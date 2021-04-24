import { to } from 'await-to-js';
import { verifyUserPermission, hasPermission } from '../../src/server/v1/permissions.util';
import { getUserEntitlementsUserProfile } from '../../src/server/v1/entitlements';
import { fetchEntitlements } from '../../src/server/v1/persistence/entitlement';

jest.mock('../../src/server/v1/entitlements', () => ({
  getUserEntitlementsUserProfile: jest.fn(),
}));

jest.mock('../../src/server/v1/persistence/entitlement.js', () => ({
  fetchEntitlements: jest.fn(),
}));

describe('Permissions Utils', () => {
  it('verifyUserPermission: Users permissions with correct application and read permission - returns false', async () => {
    const entitlements = {
      1022461: [
        'bioag:user-admin:users:read',
        'acceleron:user-admin:users:read',
      ],
    };
    const req = {
      headers: {
        'user-profile': {
          username: '1022461',
          brand: 'national',
          userType: 'dealer',
        },
      },
      body: {
        sapAccountId: '1022461',
      },
      params: {
        application: 'user-admin',
      },
    };

    getUserEntitlementsUserProfile.mockReturnValue(entitlements);
    const result = await verifyUserPermission(req.headers['user-profile'], req.body.sapAccountId, '$:user-admin:users:?');
    expect(result).toEqual(false);
  });

  it('verifyUserPermission: Validates users permissions - returns true', async () => {
    const req = {
      headers: {
        'user-profile': {
          username: '1022461',
          brand: 'national',
          userType: 'dealer',
        },
      },
      body: {
        sapAccountId: '1022461',
      },
      params: {
        application: 'user-admin',
      },
    };
    const entitlements = {
      1022461: [
        'bioag:user-admin:users:read',
        'acceleron:user-admin:users:write',
      ],
    };
    getUserEntitlementsUserProfile.mockReturnValue(entitlements);
    const result = await verifyUserPermission(req.headers['user-profile'], req.body.sapAccountId, '$:user-admin:users:?');
    expect(result).toEqual(true);
  });

  it('verifyUserPermission: User permissions is undefined - returns false', async () => {
    const req = {
      headers: {
        'user-profile': {
          username: '1022461',
          brand: 'national',
          userType: 'dealer',
        },
      },
      body: {
        sapAccountId: '1022461',
      },
      params: {
        application: 'user-admin',
      },
    };
    const entitlements = {};
    getUserEntitlementsUserProfile.mockReturnValue(entitlements);
    const result = await verifyUserPermission(req.headers['user-profile'], req.body.sapAccountId, '$:user-admin:users:?');
    expect(result).toEqual(false);
  });

  it('verifyUserPermission: User permissions does not have the specified permission - returns false', async () => {
    const req = {
      headers: {
        'user-profile': {
          username: '1022461',
          brand: 'national',
          userType: 'dealer',
        },
      },
      body: {
        sapAccountId: '1022461',
      },
      params: {
        application: 'user-admin',
      },
    };
    const entitlements = {
      1022461: [
        'bioag:user-admin:users:read',
        'acceleron:user-admin:users:write',
      ],
    };
    getUserEntitlementsUserProfile.mockReturnValue(entitlements);
    const result = await verifyUserPermission(req.headers['user-profile'], req.body.sapAccountId, '$:user-admin:shadow:?');
    expect(result).toEqual(false);
  });

  it('hasPermission: return true when read permission check for a write permission', async () => {
    const user = {
      federationId: 'abcd',
    };
    const entitlements = {
      entitlements: {
        1022461: [
          'bioag:user-admin:users:write',
          'acceleron:shadow:users:write',
          'cp:finance:users:read',
        ],
      },
    };
    fetchEntitlements.mockReturnValue(Promise.resolve(entitlements));
    const [error, result] = await to(hasPermission(user, '1022461', '$:user-admin:users:?', 'read'));
    expect(error).toBeNull();
    expect(result).toEqual(true);
    expect(fetchEntitlements).toBeCalledWith(user);
  });

  it('hasPermission: return true when write permission check for a write permission', async () => {
    const user = {
      federationId: 'abcd',
    };
    const entitlements = {
      entitlements: {
        1022461: [
          'bioag:user-admin:users:write',
          'acceleron:shadow:users:write',
          'cp:finance:users:read',
        ],
      },
    };
    fetchEntitlements.mockReturnValue(Promise.resolve(entitlements));
    const [error, result] = await to(hasPermission(user, '1022461', '$:user-admin:users:?', 'write'));
    expect(error).toBeNull();
    expect(result).toEqual(true);
    expect(fetchEntitlements).toBeCalledWith(user);
  });

  it('hasPermission: return true when read permission check for a read permission', async () => {
    const user = {
      federationId: 'abcd',
    };
    const entitlements = {
      entitlements: {
        1022461: [
          'bioag:user-admin:users:write',
          'acceleron:shadow:users:write',
          'cp:finance:users:read',
        ],
      },
    };
    fetchEntitlements.mockReturnValue(Promise.resolve(entitlements));
    const [error, result] = await to(hasPermission(user, '1022461', '$:finance:users:?', 'read'));
    expect(error).toBeNull();
    expect(result).toEqual(true);
    expect(fetchEntitlements).toBeCalledWith(user);
  });

  it('hasPermission: return error when write permission check for a read permission', async () => {
    const user = {
      federationId: 'abcd',
    };
    const entitlements = {
      entitlements: {
        1022461: [
          'bioag:user-admin:users:write',
          'acceleron:shadow:users:write',
          'cp:finance:users:read',
        ],
      },
    };
    fetchEntitlements.mockReturnValue(Promise.resolve(entitlements));
    const [error, result] = await to(hasPermission(user, '1022461', '$:finance:users:?', 'write'));
    expect(error.message).toEqual('Unauthorized');
    expect(result).toBeUndefined();
    expect(fetchEntitlements).toBeCalledWith(user);
  });

  it('hasPermission: return error no permissions for location', async () => {
    const user = {
      federationId: 'abcd',
    };
    const entitlements = {
      entitlements: {
        1022461: [
          'bioag:user-admin:users:write',
          'acceleron:shadow:users:write',
          'cp:finance:users:read',
        ],
      },
    };
    fetchEntitlements.mockReturnValue(Promise.resolve(entitlements));
    const [error, result] = await to(hasPermission(user, '1022462', '$:finance:users:?', 'read'));
    expect(error.message).toEqual('Unauthorized');
    expect(result).toBeUndefined();
    expect(fetchEntitlements).toBeCalledWith(user);
  });

  it('hasPermission: return error when fetchEntitlements fails', async () => {
    const user = {
      federationId: 'abcd',
    };
    fetchEntitlements.mockReturnValue(Promise.reject(new Error('failed')));
    const [error, result] = await to(hasPermission(user, '1022462', '$:finance:users:?', 'read'));
    expect(error.message).toEqual('Unauthorized');
    expect(result).toBeUndefined();
    expect(fetchEntitlements).toBeCalledWith(user);
  });
});
