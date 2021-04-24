import { Post, Route, Controller, Response, Body, Delete, Path } from 'tsoa';
import * as Joi from 'joi';
import * as controllers from './controllers';
import { CreatePermissionBody, ErrorResponse, SuccessResponse } from './types'
import { ErrorTypes, TypedError } from '../../../errors';
import { getPermissions } from '../../entitlements/self.service';

@Route('v1/permissions')
export class PermissionRoute extends Controller {
  @Response<SuccessResponse>('201', 'Created')
  @Response<ErrorResponse>('400', 'Bad Request')
  @Response<ErrorResponse>('500', 'Internal Server Error')
  @Post()
  public async createPermission(@Body() body: CreatePermissionBody) {
    const { id } = body;
    await this.validatePermissionIdFormat(id);
    const result = await controllers.createPermission(body);
    if(result){
        this.setStatus(201);
    }
    return result;
  };

  @Response<SuccessResponse>('200', 'Deleted')
  @Response<ErrorResponse>('404', 'Bad Request')
  @Response<ErrorResponse>('500', 'Internal Server Error')
  @Delete('{id}')
  public async deletePermission(@Path() id: string) {
    await this.validatePermissionExists(id);
    const result = await controllers.deletePermission(id);
    if(result) {
      this.setStatus(200);
    }
    return result;
  }

  async validatePermissionIdFormat(id) {
    const schema = Joi.object({
      id: Joi.string().regex(/^[a-zA-Z0-9-]+:[a-zA-Z0-9-]+:[a-zA-Z0-9-]+$/),
    });
    const validationResult = schema.validate({id});
    if(validationResult.error) {
      throw new TypedError(
        ErrorTypes.INVALID_INPUT,
        validationResult.error.details[0].message,
        validationResult.error
      );
    }
  }

  
  async validatePermissionExists(id){
    const permissions =  await getPermissions();
    const schema = Joi.object({
      id: Joi.string().valid(permissions.map(p => p.id)),
    });
    const validationResult = schema.validate({id})
    if(validationResult.error){
      throw new TypedError(
          ErrorTypes.INVALID_INPUT,
          validationResult.error.details[0].message,
          validationResult.error
      );
    }
  }
}