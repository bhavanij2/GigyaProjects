import { getUserProfile } from '../../src/server/v1/permissions.util';
import { getFederationId } from '../../src/server/v1/persistence/shadow';
import { fetchEntitlements } from '../../src/server/v1/persistence/entitlement';
import * as Test from '../../src/server/v1/controllers/entitlement';

jest.mock('../../src/server/v1/permissions.util.js', () => ({
  getUserProfile: jest.fn(),
}));

jest.mock('../../src/server/v1/persistence/shadow.js', () => ({
  getFederationId: jest.fn(),
}));

jest.mock('../../src/server/v1/persistence/entitlement.js', () => ({
  fetchEntitlements: jest.fn(),
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

let res;

describe('Entitlement Controller', () => {
  beforeEach(async () => {
    res = mockResponse();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('responds with error when getting federationId fails', async () => {
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
    getFederationId.mockReturnValue(Promise.reject(new Error('Failed to get federationId')));

    const result = await Test.getEntitlements(req, res);

    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(500);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ error: 'Failed to get federationId' });
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getFederationId).toBeCalledWith('abcd');
  });

  it('responds with error fetchEntitlements fails', async () => {
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
    const user = {
      federationId: 'abcd',
      shadow: false,
    };
    getUserProfile.mockReturnValue(userProfile);
    getFederationId.mockReturnValue(Promise.resolve(user));
    fetchEntitlements.mockReturnValue(Promise.reject(new Error('Failed to fetch entitlements')));

    const result = await Test.getEntitlements(req, res);

    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(500);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith({ error: 'Failed to fetch entitlements' });
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getFederationId).toBeCalledWith('abcd');
    expect(fetchEntitlements).toBeCalledWith(user, []);
  });

  it('responds with success when fetchEntitlements resolves', async () => {
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
    const user = {
      federationId: 'abcd',
      shadow: false,
    };
    const entitlements = {
      entitlements: 'mock',
      shadow: 'data',
    };
    getUserProfile.mockReturnValue(userProfile);
    getFederationId.mockReturnValue(Promise.resolve(user));
    fetchEntitlements.mockReturnValue(Promise.resolve(entitlements));

    const result = await Test.getEntitlements(req, res);

    expect(result.status).toBeCalled();
    expect(result.status).toBeCalledWith(200);
    expect(result.send).toBeCalled();
    expect(result.send).toBeCalledWith(entitlements);
    expect(getUserProfile).toBeCalledWith(req.headers['user-profile']);
    expect(getFederationId).toBeCalledWith('abcd');
    expect(fetchEntitlements).toBeCalledWith(user, []);
  });
});
