import { validationResult } from 'express-validator/check';
import { getUserProfile, getShadowAccess } from '../../src/server/v1/permissions.util';
import { createShadowRelationship, deleteShadowRelationship } from '../../src/server/v1/persistence/shadow';
import { getUser, updateUserBrandAndPersona } from '../../src/server/v1/persistence/user';
import uuid from 'uuid/v1';
import * as Test from '../../src/server/v1/controllers/shadow';

jest.mock('express-validator/check', () => ({
  validationResult: jest.fn(),
}));

jest.mock('../../src/server/v1/permissions.util.js', () => ({
  getUserProfile: jest.fn(),
  getShadowAccess: jest.fn(),
}));

jest.mock('../../src/server/v1/persistence/shadow.js', () => ({
  createShadowRelationship: jest.fn(),
  deleteShadowRelationship: jest.fn(),
}));

jest.mock('../../src/server/v1/persistence/user.js', () => ({
  getUser: jest.fn(),
  updateUserBrandAndPersona: jest.fn(),
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

describe('Shadow Controller', () => {
  beforeEach(async () => {
    res = mockResponse();
    validationErrors = mockValidationErrors();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('responds with access denied when not permitted', async () => {
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
    getUserProfile.mockReturnValue(userProfile);
    getShadowAccess.mockReturnValue(Promise.reject(new Error('Unauthorized')));

    const result = await Test.shadow(req, res);

    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(500);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ error: 'Unauthorized' });
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getShadowAccess).toBeCalledWith(userProfile, '$:shadowing:shadow-user:?', 'read');
  });

  it('responds with validation errors when there are validation errors', async () => {
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
    const federationIdRequired = {
      name: 'federationId',
      value: 'required',
    };
    getUserProfile.mockReturnValue(userProfile);
    getShadowAccess.mockReturnValue(Promise.resolve([{brand: 'national', persona: 'dealer', lob: 'seed', country: 'US'}]));
    validationResult.mockReturnValue(validationErrors);
    validationErrors.isEmpty.mockReturnValue(false);
    validationErrors.array.mockReturnValue([federationIdRequired]);

    const result = await Test.shadow(req, res);

    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(422);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ errors: [{ name: 'federationId', value: 'required' }] });
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getShadowAccess).toBeCalledWith(userProfile, '$:shadowing:shadow-user:?', 'read');
    expect(validationResult).toBeCalledWith(req);
    expect(validationErrors.isEmpty).toBeCalled();
    expect(validationErrors.array).toBeCalled();
  });

  it('responds with 500 error when failing to delete the relationship', async () => {
    const req = {
      headers: {
        'user-profile': {
          federationId: 'abcd',
        },
      },
      params: {
        federationId: 'efgh',
      },
    };
    const userProfile = {
      federationId: 'abcd',
    };
    const user = {
      brand: 'national',
      persona: 'dealer',
    };
    const transactionId = '123';
    getUserProfile.mockReturnValue(userProfile);
    uuid.mockReturnValue('123');
    getShadowAccess.mockReturnValue(Promise.resolve([{brand: 'national', persona: 'dealer', lob: 'seed', country: 'US'}]));
    validationResult.mockReturnValue(validationErrors);
    validationErrors.isEmpty.mockReturnValue(true);
    getUser.mockReturnValue(Promise.resolve(user));
    updateUserBrandAndPersona.mockReturnValue(Promise.resolve('Updated User!'));
    deleteShadowRelationship.mockReturnValue(Promise.reject(new Error('Failed to delete the relationship')));
    createShadowRelationship.mockReturnValue(Promise.reject(new Error('Failed to create the relationship')));

    const result = await Test.shadow(req, res);

    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(500);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ error: 'Failed to delete the relationship' });
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getShadowAccess).toBeCalledWith(userProfile, '$:shadowing:shadow-user:?', 'read');
    expect(validationResult).toBeCalledWith(req);
    expect(validationErrors.isEmpty).toBeCalled();
    expect(validationErrors.array).not.toBeCalled();
    expect(getUser).toBeCalledWith(req.params.federationId);
    expect(updateUserBrandAndPersona).toBeCalledWith(userProfile, user.brand, user.persona, transactionId);
    expect(deleteShadowRelationship).toBeCalledWith(userProfile.federationId, transactionId);
    expect(createShadowRelationship).toBeCalledWith(userProfile.federationId, req.params.federationId, transactionId);
  });

  it('responds with 500 error when failing to create the relationship', async () => {
    const req = {
      headers: {
        'user-profile': {
          federationId: 'abcd',
        },
      },
      params: {
        federationId: 'efgh',
      },
    };
    const userProfile = {
      federationId: 'abcd',
    };
    const user = {
      brand: 'national',
      persona: 'dealer',
    };
    const transactionId = '123';
    getUserProfile.mockReturnValue(userProfile);
    getShadowAccess.mockReturnValue(Promise.resolve([{brand: 'national', persona: 'dealer', lob: 'seed', country: 'US'}]));
    validationResult.mockReturnValue(validationErrors);
    validationErrors.isEmpty.mockReturnValue(true);
    uuid.mockReturnValue('123');
    getUser.mockReturnValue(Promise.resolve(user));
    updateUserBrandAndPersona.mockReturnValue(Promise.resolve('Updated User!'));
    deleteShadowRelationship.mockReturnValue(Promise.resolve('it worked!'));
    createShadowRelationship.mockReturnValue(Promise.reject(new Error('failed to create the relationship')));

    const result = await Test.shadow(req, res);

    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(500);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ error: 'failed to create the relationship' });
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getShadowAccess).toBeCalledWith(userProfile, '$:shadowing:shadow-user:?', 'read');
    expect(validationResult).toBeCalledWith(req);
    expect(validationErrors.isEmpty).toBeCalled();
    expect(validationErrors.array).not.toBeCalled();
    expect(getUser).toBeCalledWith(req.params.federationId);
    expect(updateUserBrandAndPersona).toBeCalledWith(userProfile, user.brand, user.persona, transactionId);
    expect(deleteShadowRelationship).toBeCalledWith(userProfile.federationId, transactionId);
    expect(createShadowRelationship).toBeCalledWith(userProfile.federationId, req.params.federationId, transactionId);
  });

  it('responds with 500 error when failing to getUser', async () => {
    const req = {
      headers: {
        'user-profile': {
          federationId: 'abcd',
        },
      },
      params: {
        federationId: 'efgh',
      },
    };
    const userProfile = {
      federationId: 'abcd',
    };
    getUserProfile.mockReturnValue(userProfile);
    getShadowAccess.mockReturnValue(Promise.resolve([{brand: 'national', persona: 'dealer', lob: 'seed', country: 'US'}]));
    validationResult.mockReturnValue(validationErrors);
    validationErrors.isEmpty.mockReturnValue(true);
    getUser.mockReturnValue(Promise.reject(new Error('Failed to get user')));
    deleteShadowRelationship.mockReturnValue(Promise.resolve('it worked!'));
    createShadowRelationship.mockReturnValue(Promise.resolve('it worked!'));

    const result = await Test.shadow(req, res);

    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(500);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ error: 'Failed to get user' });
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getShadowAccess).toBeCalledWith(userProfile, '$:shadowing:shadow-user:?', 'read');
    expect(validationResult).toBeCalledWith(req);
    expect(validationErrors.isEmpty).toBeCalled();
    expect(validationErrors.array).not.toBeCalled();
    expect(getUser).toBeCalledWith(req.params.federationId);
    expect(deleteShadowRelationship).not.toBeCalled();
    expect(createShadowRelationship).not.toBeCalled();
  });

  it('responds with 500 error when failing to updateUserBrandAndPersona', async () => {
    const req = {
      headers: {
        'user-profile': {
          federationId: 'abcd',
        },
      },
      params: {
        federationId: 'efgh',
      },
    };
    const userProfile = {
      federationId: 'abcd',
    };
    const user = {
      brand: 'national',
      persona: 'dealer',
    };
    const transactionId = '123';
    getUserProfile.mockReturnValue(userProfile);
    getShadowAccess.mockReturnValue(Promise.resolve([{brand: 'national', persona: 'dealer', lob: 'seed', country: 'US'}]));
    validationResult.mockReturnValue(validationErrors);
    validationErrors.isEmpty.mockReturnValue(true);
    uuid.mockReturnValue('123');
    getUser.mockReturnValue(Promise.resolve(user));
    updateUserBrandAndPersona.mockReturnValue(Promise.reject(new Error('Failed to get user')));
    deleteShadowRelationship.mockReturnValue(Promise.resolve('it worked!'));
    createShadowRelationship.mockReturnValue(Promise.resolve('it worked!'));

    const result = await Test.shadow(req, res);

    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(500);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ error: 'Failed to get user' });
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getShadowAccess).toBeCalledWith(userProfile, '$:shadowing:shadow-user:?', 'read');
    expect(validationResult).toBeCalledWith(req);
    expect(validationErrors.isEmpty).toBeCalled();
    expect(validationErrors.array).not.toBeCalled();
    expect(getUser).toBeCalledWith(req.params.federationId);
    expect(updateUserBrandAndPersona).toBeCalledWith(userProfile, user.brand, user.persona, transactionId);
    expect(deleteShadowRelationship).not.toBeCalled();
    expect(createShadowRelationship).not.toBeCalled();
  });

  it('responds with 200 success when the relationship is created', async () => {
    const req = {
      headers: {
        'user-profile': {
          federationId: 'abcd',
        },
      },
      params: {
        federationId: 'efgh',
      },
    };
    const userProfile = {
      federationId: 'abcd',
    };
    const user = {
      brand: 'national',
      persona: 'dealer',
    };
    const transactionId = '123';
    getUserProfile.mockReturnValue(userProfile);
    getShadowAccess.mockReturnValue(Promise.resolve([{brand: 'national', persona: 'dealer', lob: 'seed', country: 'US'}]));
    validationResult.mockReturnValue(validationErrors);
    validationErrors.isEmpty.mockReturnValue(true);
    uuid.mockReturnValue('123');
    deleteShadowRelationship.mockReturnValue(Promise.resolve('it worked!'));
    createShadowRelationship.mockReturnValue(Promise.resolve('it worked!'));
    getUser.mockReturnValue(Promise.resolve(user));
    updateUserBrandAndPersona.mockReturnValue(Promise.resolve('Updated User!'));

    const result = await Test.shadow(req, res);

    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(200);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ message: 'it worked!' });
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getShadowAccess).toBeCalledWith(userProfile, '$:shadowing:shadow-user:?', 'read');
    expect(validationResult).toBeCalledWith(req);
    expect(validationErrors.isEmpty).toBeCalled();
    expect(validationErrors.array).not.toBeCalled();
    expect(deleteShadowRelationship).toBeCalledWith(userProfile.federationId, transactionId);
    expect(createShadowRelationship).toBeCalledWith(userProfile.federationId, req.params.federationId, transactionId);
    expect(getUser).toBeCalledWith(req.params.federationId);
    expect(updateUserBrandAndPersona).toBeCalledWith(userProfile, user.brand, user.persona, transactionId);
  });
});
