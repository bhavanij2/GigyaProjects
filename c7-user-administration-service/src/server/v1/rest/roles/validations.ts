import Joi = require('joi');
import { TypedError, ErrorTypes } from '../../../errors';

export const validateRoleLob = async (lob, validLobs) => {
    const schema = Joi.object({
      lob: Joi.string().valid(validLobs),
    });
    try{
      await schema.validate({lob: lob});
    }catch (err) { 
      console.log('Throwing error');
      throw new TypedError(
          ErrorTypes.INVALID_INPUT,
          `Role is not set up for lob : ${err.details[0].message}`,
          err
      )
    }
}

export const validateRoleName = async (allRoles, roleName) => {
      //@ts-ignore
  const roleNames = allRoles.map(role => role.roleName);
  const schema = Joi.object({
    name: Joi.string().valid(roleNames),
  });
  try{
    await schema.validate({name: roleName});
  }catch (err) { 
    throw new TypedError(
        ErrorTypes.INVALID_INPUT,
        err.details[0].message,
        err
    )
  }
}