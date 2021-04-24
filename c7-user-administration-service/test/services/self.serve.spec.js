import {
  getPermissions,
  assignRolesPermissions,
} from '../../src/server/v1/entitlements/self.service';
import {
  readTransaction,
  writeListTransaction,
} from '../../src/server/v1/neo4j.utils';
import {
  allPermissions,
  assignRolesPermissionsQuery,
} from '../../src/server/v1/queries.util';
import { sendAuditMessage } from '../../src/server/sqs.utils';


jest.mock('../../src/server/v1/neo4j.utils', () => ({
  readTransaction: jest.fn(),
  writeListTransaction: jest.fn(),
}));

jest.mock('../../src/server/v1/queries.util', () => ({
  allPermissions: jest.fn(),
  assignRolesPermissionsQuery: jest.fn(),
}));

jest.mock('../../src/server/sqs.utils.js', () => ({
  sendAuditMessage: jest.fn(),
}));

describe('permissions tests', () => {
  it('get all permissions', async () => {
    const result = {
      records: [
        {
          keys: [
            'application',
            'action',
            'id',
            'lob',
          ],
          _fields: [
            'base',
            'agronomy',
            'cp:base:agronomy',
            'cp',
          ],
        },
        {
          keys: [
            'application',
            'action',
            'id',
            'lob',
          ],
          _fields: [
            'base',
            'agronomy',
            'seed:base:agronomy',
            'seed',
          ],
        },
      ],
    };
    const queryResult = `    
    MATCH (p:Permission) 
    RETURN p.application, p.action, p.id, p.lob`;

    allPermissions.mockReturnValue(queryResult);
    readTransaction.mockReturnValue(result);
    const actual = await getPermissions();
    const expected = [
      {
        action: 'agronomy',
        application: 'base',
        id: 'cp:base:agronomy',
        lob: 'cp',
      },
      {
        action: 'agronomy',
        application: 'base',
        id: 'seed:base:agronomy',
        lob: 'seed',
      },
    ];
    expect(actual).toEqual(expected);
  });

  it('assignRolesPermissions calls assignPrimaryRolesPermissions', async () => {
    const permissionList = {
      permissions: [
        {
          id: 'cp:base:farmers',
          type: 'read',
        },
      ],
    };
    const adjustedList = {
      permissions: [
        {
          id: 'cp:base:farmers',
          type: 'read',
          roleName: 'Sales',
          lob: 'cp',
        },
      ],
    };
    const roleName = 'Sales';
    const roleLob = undefined;
    const userProfile = {
      federationId: '1111'
    }
    sendAuditMessage.mockReturnValue();
    await assignRolesPermissions(roleName, permissionList.permissions, roleLob, userProfile);
    expect(writeListTransaction).toHaveBeenLastCalledWith(assignRolesPermissionsQuery, 'Sales', adjustedList.permissions);
  });

  it('assignRolesPermissions calls assignTestRolesPermissions assigns permissions to test roles for all lob', async () => {
    const permissionList = {
      permissions: [
        {
          id: 'cp:base:farmers',
          type: 'read',
        },
      ],
    };
    const roleName = 'Sales';
    const roleLob = '*';
    writeListTransaction.mockReturnValue('SUCCESS');

    const result = await assignRolesPermissions(roleName, permissionList.permissions, roleLob);
    expect(result).toEqual({ code: '201', message: `Permissions were added to testing role ${roleName}` });
  });

  it('assignRolesPermissions does not assign permissions to test roles for lobParameter other than *', async () => {
    const permissionList = {
      permissions: [
        {
          id: 'cp:base:farmers',
          type: 'read',
        },
      ],
    };
    const roleName = 'Sales';
    const roleLob = 'k';
    writeListTransaction.mockReturnValue('SUCCESS');

    const result = await assignRolesPermissions(roleName, permissionList.permissions, roleLob);
    expect(result).toEqual({ code: '404', message: 'Optional Role Lob optional parameter must be * or empty' });
  });
});
