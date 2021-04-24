import { ResponseCodes } from './response.utils';

export const ErrorTypes = {
  INTERNAL_SERVER_ERROR: 'InternalServerError',
  INVALID_INPUT: 'InvalidInputError',
  NEO4J_ERROR: 'Neo4jError',
  NEO4J_WRITE_TRANSACTION_ERROR: 'Neo4jWriteTransactionError',
  RESOURCE_NOT_FOUND: 'ResourceNotFoundError',
  UNAUTHORIZED: 'Unauthorized',
};

const errorTypeCodes = {
  GigyaError: ResponseCodes.INTERNAL_SERVER_ERROR,
  InternalServerError: ResponseCodes.INTERNAL_SERVER_ERROR,
  InvalidInputError: ResponseCodes.INVALID_REQUEST_ERROR,
  Neo4jError: ResponseCodes.INTERNAL_SERVER_ERROR,
  Neo4jWriteTransactionError: ResponseCodes.INTERNAL_SERVER_ERROR,
  ResourceNotFoundError: ResponseCodes.RESOURCE_NOT_FOUND,
  Unauthorized: ResponseCodes.UNAUTHORIZED,
};

export class TypedError extends Error {
  constructor(name, message, errorDetails = []) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = name;
    this.message = message || 'An unknown error has occured.';
    this.statusCode = errorTypeCodes[name];
    this.errorDetails = errorDetails;
  }
}

export const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || err.code || err.status).json(err);
  next(err);
};

export const logError = (err, req, res, next) => {
  console.error(err);
  next(err);
};
