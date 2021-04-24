import postUserRequirements from './route-validations';
import { PostUserStatusCodes } from '../response.utils';

const requireStringInSchema = (reqs, field) => {
  reqs[field] = {
    in: ['body'],
    errorMessage: `A value in field ${field} is required.`,
    isString: true,
    isLength: {
      options: { min: 1 },
    },
  };
};

const requireArrayInSchema = (reqs, field) => {
  reqs[field] = {
    in: ['body'],
    errorMessage: `A nonempty array is required for field ${field}.`,
    isArray: true,
    isLength: {
      options: { min: 1 },
    },
  };
};

export const postUserFormRequirements = params => {
  const requirements = {};
  const { multiloc } = params;
  postUserRequirements(multiloc).requiredFields.string.forEach(field => {
    requireStringInSchema(requirements, field);
  });
  postUserRequirements(multiloc).requiredFields.array.forEach(field => {
    requireArrayInSchema(requirements, field);
  });
  return requirements;
};

export const postUserErrorFormatter = validatorError => Object.assign(validatorError, { status: PostUserStatusCodes[validatorError.param] });
