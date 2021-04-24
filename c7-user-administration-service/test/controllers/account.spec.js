import { getUserProfile } from '../../src/server/v1/permissions.util';
import { fetchUserWithAccountsByFederationId } from '../../src/server/v1/persistence/account';
import { getFederationId } from '../../src/server/v1/persistence/shadow';
import * as Test from '../../src/server/v1/controllers/account';

jest.mock('../../src/server/v1/permissions.util.js', () => ({
  getUserProfile: jest.fn(),
}));

jest.mock('../../src/server/v1/persistence/shadow.js', () => ({
  getFederationId: jest.fn(),
}));

jest.mock('../../src/server/v1/persistence/account', () => ({
  fetchUserWithAccountsByFederationId: jest.fn(),
}));
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

let res;

describe('Account Controller Tests', () => {
  beforeEach(async () => {
    res = mockResponse();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  it('Status 200 with user and accounts data', async () => {
    const userProfile = {
      federationId: '1234r5678',
    };
    const req = {
      headers: {
        'user-profile': userProfile,
      },
    };
    const user = {
      federationId: userProfile.federationId,
      shadow: false,
    };
    const userWithAccounts = {
      userName: 'test@test.com',
      accounts: [],
    };
    const scopes = [];
    getUserProfile.mockReturnValue(userProfile);
    getFederationId.mockReturnValue(Promise.resolve(user));
    fetchUserWithAccountsByFederationId.mockReturnValue(Promise.resolve(userWithAccounts));

    const result = await Test.getAccounts(req, res);
    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(200);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith(userWithAccounts);
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getFederationId).toBeCalledWith(userProfile.federationId);
    expect(fetchUserWithAccountsByFederationId).toBeCalledWith(user, scopes);
  });

  it('Status 500 with error to get federation id', async () => {
    const userProfile = {
      federationId: 'abcd',
    };
    const req = {
      headers: {
        'user-profile': userProfile,
      },
    };

    getUserProfile.mockReturnValue(userProfile);
    getFederationId.mockReturnValue(Promise.reject(new Error('Failed to get Federation Id')));

    const result = await Test.getAccounts(req, res);
    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(500);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ error: 'Failed to get Federation Id' });
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getFederationId).toBeCalledWith(userProfile.federationId);
  });

  it('Status 500 with error Failed to read accounts data from Neo4j', async () => {
    const userProfile = {
      federationId: '1234r5678',
    };
    const req = {
      headers: {
        'user-profile': userProfile,
      },
    };
    const user = {
      federationId: userProfile.federationId,
      shadow: false,
    };
    const scopes = [];
    getUserProfile.mockReturnValue(userProfile);
    getFederationId.mockReturnValue(Promise.resolve(user));
    fetchUserWithAccountsByFederationId.mockReturnValue(Promise.reject(new Error('Failed to read accounts data from Neo4j')));

    const result = await Test.getAccounts(req, res);
    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(500);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ error: 'Failed to read accounts data from Neo4j' });
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getFederationId).toBeCalledWith(userProfile.federationId);
    expect(fetchUserWithAccountsByFederationId).toBeCalledWith(user, scopes);
  });
});
