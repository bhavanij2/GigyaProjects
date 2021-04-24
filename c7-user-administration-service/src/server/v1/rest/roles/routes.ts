import { Get, Post, Path, Patch, Delete, Body, Route, Request, Controller, Response, Query } from 'tsoa';
import { AddRoleRequestBody, ErrorResponse, SuccessResponse, PartialRole, PermissionBody } from './types'
import * as controllers from './controllers';
import * as services from './services';
import { ErrorTypes, TypedError } from '../../../errors';
import countryCodes from './country.code';

import express = require('express');
import Joi = require('joi');
import {
  getUserProfile,
} from '../../permissions.util';
import { validateRoleName, validateRoleLob } from './validations';
import validatePermissionExists from '../permissions/validations';
import assignRolesPermissions, { adjustList, deleteRolesPermissions } from '../../entitlements/self.service';

@Route('v1/roles')
export class RolesRoute extends Controller {

    async validateAddRole(request) {
        const pattern = /[a-zA-Z0-9]*:{1}[a-zA-Z0-9]*:{1}[a-zA-Z0-9]*/;
        const validCountryCodes = countryCodes().map(country => country.Code);
        const schema = Joi.object({
            id: Joi.string()
                .regex(pattern),
            name: Joi.string().required(),
            lob: Joi.string().required(),
            brand: Joi.string().required(),
            persona: Joi.string().required(),
            country: Joi.string().valid(validCountryCodes),
            scope: Joi.string().required(),
            description: Joi.string().required(),
            longDescription: Joi.string().required(),
            beta: Joi.boolean().required(),
            internal: Joi.boolean().required(),
        });
        try {
            await schema.validate(request.body);
        }
        catch (err) { 
            throw new TypedError(
                ErrorTypes.INVALID_INPUT,
                err.details[0].message,
                err
            )
        }
    }
    catch (err) {
      throw new TypedError(
        ErrorTypes.INVALID_INPUT,
        err.details[0].message,
        err,
      );
    }


    async validateRoleIdExists(roleid, field){
        const rolesArray =  await services.getRolesServices({})
        //@ts-ignore
        const roleIdArray = rolesArray.map(role => role.roleId)
        const schema = Joi.object({
            [field]: Joi.string().valid(roleIdArray),
        });
        const validationResults = schema.validate({[field]: roleid})
        if(validationResults.error){
            throw new TypedError(ErrorTypes.INVALID_INPUT,
                validationResults.error.details[0].message,
                validationResults.error)
        }
    }

    @Get()
    public async getRoles(
        @Query() brand?: string,
        @Query() persona?: string,
        @Query() country?: string,
        @Query() name?: string,
        @Query() id?: string,
        @Query() lob?: string,
        @Query() internal?: boolean,
        @Query() beta?: boolean ) {
        const result = await controllers.getRoles({ brand, persona, country, name, id, lob, internal, beta });
        if(result){
            this.setStatus(200);
        }
        return result;
    };

    @Response<SuccessResponse>('200', 'Created')
    @Response<ErrorResponse>('400', 'Bad Request')
    @Response<ErrorResponse>('500', 'Internal Server Error')
    @Patch('{id}')
    public async updatePartialRoles(
        @Body() role: PartialRole,
        @Path() id: string ) {
        await this.validateRoleIdExists(id, 'id');
        if(role.newRoleId){
            await this.validateRoleIdExists(role.newRoleId, 'newRoleId');
        }
        const result = await controllers.updatePartialRole(id, role);
        if(result){
            this.setStatus(200);
        }
        return {
            status: 200,
            message: 'Role updated',
            result,
        };
    };

    @Response<SuccessResponse>('201', 'Created')
    @Response<ErrorResponse>('400', 'Bad Request')
    @Response<ErrorResponse>('500', 'Internal Server Error')
    @Post()
    public async addRole(
        @Body() addRoleRequestBody: AddRoleRequestBody,
        @Request() request: express.Request):Promise<any>{
        await this.validateAddRole(request);
        const userProfile = getUserProfile(request.headers['user-profile']);
        const result = await controllers.addRole(addRoleRequestBody, userProfile);
        if(result){
            this.setStatus(201);
        }
        return {
            status: 201,
            message: 'Resource created'
        };
    };
  

    @Response<SuccessResponse>('200', 'Deleted')
    @Response<ErrorResponse>('404', 'Bad Request')
    @Response<ErrorResponse>('500', 'Internal Server Error')
    @Delete('{roleid}')
    public async deleteRole(
        @Path() roleid: string,
        @Request() request: express.Request) {

        await this.validateRoleIdExists(roleid, 'id');
        const userProfile = getUserProfile(request.headers['user-profile']);
        const result = await controllers.deleteRole(roleid, userProfile);
        if(result){
            this.setStatus(200)
        }
        return {
            status: 200,
            message: 'Resource deleted',
            result
        };
    };

    async validateRoleHasLob(allRoles, roleName, permissions) {
        const validLobsFolerole = allRoles
        //@ts-ignore
        .filter(role => role.roleName === roleName)
        //@ts-ignore
        .map(role => role.lob)
      const adjustedList = adjustList(roleName, permissions);
      const permissionLobs = adjustedList.map(p => p.lob)
      await Promise.all(permissionLobs.map(p => validateRoleLob(p, validLobsFolerole)))
    }

    async validatePermissions(permissions) {
        await Promise.all(permissions.map(p => validatePermissionExists(p.id)))
    }

    @Response<SuccessResponse>('200', 'Created')
    @Response<ErrorResponse>('400', 'Bad Request')
    @Response<ErrorResponse>('500', 'Internal Server Error')
    @Post('{roleName}/permissions')
    public async addPermissionToRole(
        @Body() permissionBody: PermissionBody,
        @Path() roleName: string,
        @Request() request: express.Request, 
        @Query() lob?: string) {
        const allRoles = await services.getRolesServices({});
        await validateRoleName(allRoles, roleName)
        await this.validateRoleHasLob(allRoles, roleName, permissionBody.permissions);
        await this.validatePermissions(permissionBody.permissions);
      
        const userProfile = getUserProfile(request.headers['user-profile']);
        const result = await assignRolesPermissions(roleName, permissionBody.permissions, lob, userProfile);
        return {
            status: result.code,
            message: result.message
        }
    };

    @Response<SuccessResponse>('200', 'Created')
    @Response<ErrorResponse>('400', 'Bad Request')
    @Response<ErrorResponse>('500', 'Internal Server Error')
    @Delete('{roleName}/permissions')
    public async deletePermissionToRole(
        @Path() roleName: string,
        @Request() request: express.Request) {
        const allRoles = await services.getRolesServices({});
        await validateRoleName(allRoles, roleName)
        const permissionBody: PermissionBody = request.body;
        await this.validateRoleHasLob(allRoles, roleName, permissionBody.permissions);
        await this.validatePermissions(permissionBody.permissions);
      
        const userProfile = getUserProfile(request.headers['user-profile']);
        const result = await deleteRolesPermissions(roleName, permissionBody.permissions, userProfile);
        return {
            status: result.code,
            message: result.message
        }
    };
}
