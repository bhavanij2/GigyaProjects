import { validationResult } from 'express-validator/check';
import { getUserProfile } from '../../src/server/v1/permissions.util';
import { createInternalUser, getUser } from '../../src/server/v1/persistence/user';
import { deleteShadowRelationship } from '../../src/server/v1/persistence/shadow';
import uuid from 'uuid/v1';
import * as Test from '../../src/server/v1/controllers/user';

jest.mock('express-validator/check', () => ({
  validationResult: jest.fn(),
}));

jest.mock('../../src/server/v1/permissions.util.js', () => ({
  getUserProfile: jest.fn(),
}));

jest.mock('../../src/server/v1/persistence/user.js', () => ({
  createInternalUser: jest.fn(),
  getUser: jest.fn(),
}));

jest.mock('../../src/server/v1/persistence/shadow.js', () => ({
  deleteShadowRelationship: jest.fn(),
}));

jest.mock('uuid/v1', () => jest.fn());

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const mockValidationErrors = () => {
  const errors = {};
  errors.array = jest.fn();
  errors.isEmpty = jest.fn();
  return errors;
};

let res;
let validationErrors;

describe('User Controller', () => {
  beforeEach(async () => {
    res = mockResponse();
    validationErrors = mockValidationErrors();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('responds with validation errors when some are found', async () => {
    const req = {
      headers: {},
    };
    const userProfileRequired = {
      name: 'user-profile',
      value: 'required',
    };
    validationResult.mockReturnValue(validationErrors);
    validationErrors.isEmpty.mockReturnValue(false);
    validationErrors.array.mockReturnValue([userProfileRequired]);

    const result = await Test.createInternalUser(req, res);

    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(422);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ errors: [{ name: 'user-profile', value: 'required' }] });
    expect(validationResult).toBeCalledWith(req);
    expect(validationErrors.isEmpty).toBeCalled();
    expect(validationErrors.array).toBeCalled();
  });

  it('responds with 500 error message when error occurs finding user', async () => {
    const req = {
      headers: {
        'user-profile': {
          federationId: 'abcd',
        },
      },
    };
    const userProfile = {
      federationId: 'abcd',
    };
    validationResult.mockReturnValue(validationErrors);
    validationErrors.isEmpty.mockReturnValue(true);
    getUserProfile.mockReturnValue(userProfile);
    getUser.mockReturnValue(Promise.reject(new Error('error message')));

    const result = await Test.createInternalUser(req, res);

    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(500);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ error: 'error message' });
    expect(validationErrors.isEmpty).toBeCalled();
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getUser).toBeCalledWith(userProfile.federationId);
  });

  it('responds with 500 error message when delete shadow relationship fails', async () => {
    const req = {
      headers: {
        'user-profile': {
          federationId: 'abcd',
        },
      },
    };
    const userProfile = {
      federationId: 'abcd',
    };
    const transactionId = '123';
    uuid.mockReturnValue('123');
    validationResult.mockReturnValue(validationErrors);
    validationErrors.isEmpty.mockReturnValue(true);
    getUserProfile.mockReturnValue(userProfile);
    getUser.mockReturnValue(Promise.resolve({ user: 'some user' }));
    deleteShadowRelationship.mockReturnValue(Promise.reject(new Error('error message')));

    const result = await Test.createInternalUser(req, res);

    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(500);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ error: 'error message' });
    expect(validationErrors.isEmpty).toBeCalled();
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getUser).toBeCalledWith(userProfile.federationId);
    expect(deleteShadowRelationship).toBeCalledWith(userProfile.federationId, transactionId);
    expect(createInternalUser).not.toHaveBeenCalled();
  });

  it('responds with 200 message and deletes shadow relationships when user exists', async () => {
    const req = {
      headers: {
        'user-profile': {
          federationId: 'abcd',
        },
      },
    };
    const userProfile = {
      federationId: 'abcd',
    };
    const transactionId = '123';
    validationResult.mockReturnValue(validationErrors);
    validationErrors.isEmpty.mockReturnValue(true);
    uuid.mockReturnValue('123');
    getUserProfile.mockReturnValue(userProfile);
    getUser.mockReturnValue(Promise.resolve({ user: 'some user' }));
    deleteShadowRelationship.mockReturnValue(Promise.resolve('It worked!'));

    const result = await Test.createInternalUser(req, res);

    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(200);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ message: 'User exists' });
    expect(validationErrors.isEmpty).toBeCalled();
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getUser).toBeCalledWith(userProfile.federationId);
    expect(deleteShadowRelationship).toBeCalledWith(userProfile.federationId, transactionId);
    expect(createInternalUser).not.toHaveBeenCalled();
  });

  it('responds with 500 error message when user creation fails', async () => {
    const req = {
      headers: {
        'user-profile': {
          federationId: 'abcd',
        },
      },
    };
    const userProfile = {
      federationId: 'abcd',
    };
    const transactionId = '123';
    validationResult.mockReturnValue(validationErrors);
    validationErrors.isEmpty.mockReturnValue(true);
    uuid.mockReturnValue('123');
    getUserProfile.mockReturnValue(userProfile);
    getUser.mockReturnValue(Promise.resolve(undefined));
    createInternalUser.mockReturnValue(Promise.reject(new Error('error message')));

    const result = await Test.createInternalUser(req, res);

    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(500);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ error: 'error message' });
    expect(validationErrors.isEmpty).toBeCalled();
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getUser).toBeCalledWith(userProfile.federationId);
    expect(deleteShadowRelationship).not.toHaveBeenCalled();
    expect(createInternalUser).toBeCalledWith(userProfile, transactionId);
  });

  it('responds with 200 success message when user is created', async () => {
    const req = {
      headers: {
        'user-profile': {
          federationId: 'abcd',
        },
      },
    };
    const userProfile = {
      federationId: 'abcd',
    };
    const transactionId = '123';
    validationResult.mockReturnValue(validationErrors);
    validationErrors.isEmpty.mockReturnValue(true);
    uuid.mockReturnValue('123');
    getUserProfile.mockReturnValue(userProfile);
    getUser.mockReturnValue(Promise.resolve(undefined));
    createInternalUser.mockReturnValue(Promise.resolve('User Created'));

    const result = await Test.createInternalUser(req, res);

    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(200);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ message: 'User Created' });
    expect(validationErrors.isEmpty).toBeCalled();
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getUser).toBeCalledWith(userProfile.federationId);
    expect(deleteShadowRelationship).not.toHaveBeenCalled();
    expect(createInternalUser).toBeCalledWith(userProfile, transactionId);
  });
});
