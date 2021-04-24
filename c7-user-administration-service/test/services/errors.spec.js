import {
  TypedError,
  ErrorTypes,
} from '../../src/server/errors';
import { ResponseCodes } from '../../src/server/response.utils';

describe('errors', () => {
  it('returns correct status for each error type.', () => {
    Object.keys(ErrorTypes).forEach(key => {
      const typedError = new TypedError(
        ErrorTypes[key],
        `This is an error of type ${key}`,
      );
      if (typedError.name === ErrorTypes.RESOURCE_NOT_FOUND) {
        expect(typedError.statusCode).toEqual(ResponseCodes.RESOURCE_NOT_FOUND);
      }
      else if (typedError.name === ErrorTypes.INVALID_INPUT) {
        expect(typedError.statusCode).toEqual(ResponseCodes.INVALID_REQUEST_ERROR);
      }
      else if (typedError.name === ErrorTypes.UNAUTHORIZED) {
        expect(typedError.statusCode).toEqual(ResponseCodes.UNAUTHORIZED);
      }
      else {
        expect(typedError.statusCode).toEqual(ResponseCodes.INTERNAL_SERVER_ERROR);
      }
    });
  });
});
