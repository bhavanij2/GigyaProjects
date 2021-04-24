import {
  Route, Controller, Response, Get, Header,
} from 'tsoa';
import controllers from './controllers';
import { ErrorResponse, SuccessResponse } from './types';
import { ErrorTypes, TypedError } from '../../../errors';

// TODO: http://jira.monsanto.com/browse/GCX-3612
@Route('v1/groups')
export class GroupsRoute extends Controller {
  @Response<SuccessResponse>('200', 'OK')
  @Response<ErrorResponse>('400', 'Bad Request')
  @Response<ErrorResponse>('500', 'Internal Server Error')
  @Get('/permissions')
  public async getPermissionsFromGroups(
    @Header('user-profile') userProfile: string,
  ) {
    try {
      const profile = JSON.parse(userProfile);
      const result = await controllers.getInternalPermissions(profile);
      if (result) {
        this.setStatus(200);
      }
      return result;
    }
    catch (e) {
      const [ErrorType, ErrorMessage] = e instanceof SyntaxError ?
        [ErrorTypes.INVALID_INPUT, `header "user-profile" is required: ${e}`] :
        [ErrorTypes.INTERNAL_SERVER_ERROR, `internal server error: ${e}`];
      throw new TypedError(ErrorType, ErrorMessage, e);
    }
  }
}
