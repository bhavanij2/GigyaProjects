import { Get, Route, Post, Body, Header, Path, SuccessResponse, Controller, Request, Security } from 'tsoa';
import express from 'express';

import { ResponseCodes } from '../../../response.utils';

import {
  AddUserRoleRequestBody,
  User,
  UserAccountsResponse,
  UserEntitlementsResponse,
  UserInfoResponse,
  GetUserRolesResponseObject,
  Brand,
  Persona,
  GetUserProfileResponse,
} from './types';
import * as controllers from './controllers';

@Route('v1/users')
export class GetUsers extends Controller {
  @Get()
  @Security('external', ['$:uadmin:search-user:read'])
  @Security('internal', ['$:uadmin:search-user:read'])
  @Security('api')
  public async getUsers(
    @Request() req: express.Request
  ): Promise<User[]> {
    const { sapId, ...userData } = req.query;
    return controllers.getUsers(userData, sapId);
  }

  @SuccessResponse(ResponseCodes.CREATED_SUCCESS)
  @Security('external', ['$:uadmin:edit-user:write'])
  @Security('internal', ['$:uadmin:edit-user:write'])
  @Security('api')
  @Post('{federationId}/roles/{roleName}/locations/{locationId}')
  public async addUserRole(
    @Body() addUserRoleRequestBody: AddUserRoleRequestBody,
    @Path() federationId: string,
    @Path() roleName: string,
    @Path() locationId: string,
    @Header('user-profile') userProfileHeader?: string,
  ): Promise<string> {
    const result = controllers.addUserRole(
      addUserRoleRequestBody,
      federationId,
      roleName,
      locationId,
      userProfileHeader,
    );
    if (result) {
      this.setStatus(ResponseCodes.CREATED_SUCCESS);
    }
    return result;
  }

  @Get('{federationId}/accounts')
  public async getUserAccountsByFederationId(@Path() federationId: string): Promise<UserAccountsResponse> {
    return controllers.getUserAccountsByFedId(federationId);
  }

  @Get('{federationId}/entitlements')
  public async getUserEntitlements(@Path() federationId: string): Promise<UserEntitlementsResponse> {
    return controllers.getUserEntitlements(federationId);
  }

  @Get('{federationId}/entitlements/{application}')
  public async getUserEntitlementsByApplication(
    @Path() federationId: string,
    @Path() application: string,
  ): Promise<UserEntitlementsResponse> {
    return controllers.getUserEntitlementsByApplication(federationId, application);
  }

  @Get('{federationId}/info')
  public async getUserInfo(@Path() federationId: string): Promise<UserInfoResponse> {
    return controllers.getUserInfo(federationId);
  }

  @Get('{federationId}/roles')
  public async getUserRoles(@Path() federationId: string): Promise<GetUserRolesResponseObject[]> {
    return controllers.getUserRoles(federationId);
  }

  @Get('{userId}/brands/{brand}/personas/{persona}/entitlements/')
  public async getUserEntitlementsUserProfile(
    @Path() userId: string,
    @Path() brand: Brand,
    @Path() persona: Persona,
  ): Promise<UserEntitlementsResponse> {
    return controllers.getUserEntitlementsUserProfile(userId, brand, persona);
  }

  @Get('{userId}/brands/{brand}/personas/{persona}/profile')
  public async getUserProfileByEmailBrandPersona(
    @Path() userId: string,
    @Path() brand: Brand,
    @Path() persona: Persona,
  ): Promise<GetUserProfileResponse> {
    return controllers.getUserProfileByEmailBrandPersona(userId, brand, persona);
  }
}
