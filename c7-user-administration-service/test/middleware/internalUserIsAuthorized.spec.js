import cf from '@monsantoit/cloud-foundry';
import oauth from '@monsantoit/oauth-ping';
import {
  getEntitlementsFromRole,
  getRolesFromEntitlement,
} from '../../src/server/v1/middleware/internal-authorization/velocity-mappings';
import { internalUserIsAuthorized, ensureRoleParamIsNotInternal, ensureRoleBodyIsNotInternal } from '../../src/server/v1/middleware/internal-authorization';

/**
 * STUB PROXY
 */

const servicesProxy = {
  get: () => '',
};

const sp = new Proxy({}, servicesProxy);


/**
 * MOCK Modules
 */

jest.mock('@monsantoit/cloud-foundry');
jest.mock('@monsantoit/oauth-ping');
jest.mock('../../src/server/v1/middleware/internal-authorization/velocity-mappings.js');

oauth.httpGetToken.mockReturnValue(() => new Promise(resolve => resolve(true)));
cf.services['hybris-location-hierarchy-api'] = sp;
cf.services['acs2-ping-client'] = sp;
cf.services.ping = sp;

function ExpressMock() {
  const mock = {
    req: {
      app: {
        locals: {
          docClient: null,
        },
      },
      headers: {
        admintype: null,
        Authorization: 'Bearer Lp7gWbwnpnEuD3ZeNfZOjzCmJzrI>',
        'user-profile': null,
      },
      params: {
        sapId: null,
        roleName: null,
      },
      body: {
        newRole: null,
      },
      query: {
        'account-name': null,
      },
    },
    res: {
      status: () => mock.res,
      send: jest.fn(),
    },
    next: () => null,
  };

  return mock;
}

describe('internalUserHasRole middleware', () => {
  const express = ExpressMock();

  it('does not call getRolesFromEntitlement when adminType is not Internal', async () => {
    const { req, res, next } = express;
    await internalUserIsAuthorized(req, res, next);

    expect(getRolesFromEntitlement).not.toBeCalled();
    expect(getEntitlementsFromRole).not.toBeCalled();
  });

  it('returns unauthorized response if user has no valid entitlements', async () => {
    const { req, res, next } = express;
    req.headers.admintype = 'Internal';
    const badUserProfileHeader = {
      id: 'test_user',
      entitlements: {
        'c7-internal-user-admin': [
          'bad-user-admin',
        ],
      },
    };
    req.headers['user-profile'] = JSON.stringify(badUserProfileHeader);

    getEntitlementsFromRole.mockReturnValue(['internal-user-admin']);
    getRolesFromEntitlement.mockReturnValue([]);

    await internalUserIsAuthorized(req, res, next);

    const results = res.send.mock.calls[0][0];
    const expectedMessage = 'This user is not authorized to search users.';

    expect(results.error).toBe(expectedMessage);
  });

  it('internalUserEntitlements saves user roles to req from user entitlements', async () => {
    const { req, res, next } = express;
    req.headers.admintype = 'Internal';
    const roles = ['glb:int-ua:ad'];
    const goodUserProfileHeader = {
      id: 'test_user',
      entitlements: {
        'c7-internal-user-admin': [
          'internal-user-admin',
        ],
      },
    };
    req.headers['user-profile'] = JSON.stringify(goodUserProfileHeader);

    getEntitlementsFromRole.mockReturnValue(['internal-user-admin']);
    getRolesFromEntitlement.mockReturnValue(roles);

    await internalUserIsAuthorized(req, res, next);

    expect(req.internalUserRoles.length).toBe(1);
    expect(req.internalUserRoles[0]).toBe(roles);
  });
});

describe('ensureRoleParamIsNotInternal middleware', () => {
  const express = ExpressMock();

  it('returns unauthorized response if internal role is passed in request', async () => {
    const { req, res } = express;
    req.params.roleName = 'Internal Admin';

    await ensureRoleParamIsNotInternal(req, res);

    const results = res.send.mock.calls[0][0];
    const expectedMessage = 'Not authorized to add an internal role.';

    expect(results.error).toBe(expectedMessage);
  });

  it('continues if roleName is not internal', async () => {
    const next = jest.fn();
    const { req, res } = express;
    
    req.params.roleName = 'Site Manager';

    await ensureRoleParamIsNotInternal(req, res, next);

    expect(next).toBeCalled();
  });
});

describe('ensureRoleBodyIsNotInternal middleware', () => {
  const express = ExpressMock();

  it('returns unauthorized response if new internal role is passed in request', async () => {
    const { req, res } = express;
    req.body.newRole = 'Internal Admin';

    await ensureRoleBodyIsNotInternal(req, res);

    const results = res.send.mock.calls[0][0];
    const expectedMessage = 'Not authorized to add an internal role.';

    expect(results.error).toBe(expectedMessage);
  });

  it('continues if newRole is not internal', async () => {
    const next = jest.fn();
    const { req, res } = express;
    
    req.body.newRole = 'Site Manager';

    await ensureRoleBodyIsNotInternal(req, res, next);

    expect(next).toBeCalled();
  });
});
