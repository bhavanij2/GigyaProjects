import { to } from 'await-to-js';
import { readTransaction } from '../../src/server/v1/transaction/read';
import { getUserEntitlementsQuery } from '../../src/server/v1/rest/users/users.queries';
import * as Test from '../../src/server/v1/persistence/entitlement';

jest.mock('../../src/server/v1/transaction/read.js', () => ({
  readTransaction: jest.fn(),
}));

jest.mock('../../src/server/v1/rest/users/users.queries.js', () => ({
  getUserEntitlementsQuery: jest.fn(),
}));

const mockRead = {
  records: [
    {
      keys: [
        'userId',
        'sapAccountId',
        'permissionType',
        'action',
        'pid',
      ],
      length: 5,
      _fields: [
        'clint.burmester',
        '0003493404',
        'write',
        'warehouse-inventory',
        'seed:myaccount:warehouse-inventory',
      ],
      _fieldLookup: {
        userId: 0,
        sapAccountId: 1,
        permissionType: 2,
        action: 3,
        pid: 4,
      },
    },
    {
      keys: [
        'userId',
        'sapAccountId',
        'permissionType',
        'action',
        'pid',
      ],
      length: 5,
      _fields: [
        'clint.burmester',
        '0003493404',
        'write',
        'channel-list-of-shipments',
        'seed:myaccount:channel-list-of-shipments',
      ],
      _fieldLookup: {
        userId: 0,
        sapAccountId: 1,
        permissionType: 2,
        action: 3,
        pid: 4,
      },
    },
  ],
};

describe('Entitlement Persistence', () => {
  it('resolves to read when shadow', async () => {
    const query = 'query';
    const user = {
      federationId: 'abcd',
      shadow: true,
    };
    getUserEntitlementsQuery.mockReturnValue(query);
    readTransaction.mockReturnValue(Promise.resolve(mockRead));

    const [error, result] = await to(Test.fetchEntitlements(user));

    expect(error).toBeNull();
    expect(result).toMatchObject({
      entitlements: {
        '0003493404': ['seed:myaccount:warehouse-inventory:read', 'seed:myaccount:channel-list-of-shipments:read'],
      },
      shadow: {
        federationId: 'abcd',
      },
    });
    expect(getUserEntitlementsQuery).toBeCalledWith(user.federationId, undefined);
    expect(readTransaction).toBeCalledWith(query);
  });

  it('resolves to write when not shadow', async () => {
    const query = 'query';
    const user = {
      federationId: 'abcd',
      shadow: false,
    };
    getUserEntitlementsQuery.mockReturnValue(query);
    readTransaction.mockReturnValue(Promise.resolve(mockRead));

    const [error, result] = await to(Test.fetchEntitlements(user));

    expect(error).toBeNull();
    expect(result).toMatchObject({
      entitlements: {
        '0003493404': ['seed:myaccount:warehouse-inventory:write', 'seed:myaccount:channel-list-of-shipments:write'],
      },
    });
    expect(getUserEntitlementsQuery).toBeCalledWith(user.federationId, undefined);
    expect(readTransaction).toBeCalledWith(query);
  });

  it('rejects when an error occurs when calling readTransaction', async () => {
    const query = 'query';
    const user = {
      federationId: 'abcd',
      shadow: false,
    };
    getUserEntitlementsQuery.mockReturnValue(query);
    readTransaction.mockReturnValue(Promise.reject(new Error('something bad happened')));

    const [error] = await to(Test.fetchEntitlements(user));

    expect(error.message).toBe('Failed to read from Neo4j; something bad happened');
    expect(readTransaction).toBeCalledWith(query);
  });
});
