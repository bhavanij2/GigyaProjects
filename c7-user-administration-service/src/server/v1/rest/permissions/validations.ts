import { TypedError, ErrorTypes } from '../../../errors';
import { getPermissions } from '../../entitlements/self.service';

import Joi = require('joi');

async function validatePermissionExists(id) {
  const permissions = await getPermissions();
  const schema = Joi.object({
    id: Joi.string().valid(permissions.map(p => p.id)),
  });
  const validationResult = schema.validate({ id });
  if (validationResult.error) {
    throw new TypedError(
      ErrorTypes.INVALID_INPUT,
      validationResult.error.details[0].message,
      validationResult.error,
    );
  }
}


export default validatePermissionExists;
