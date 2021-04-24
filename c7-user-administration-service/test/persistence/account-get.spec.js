import { to } from 'await-to-js';
import { readTransaction } from '../../src/server/v1/transaction/read';
import { getUserAccountsQuery } from '../../src/server/v1/rest/users/users.queries';
import * as Test from '../../src/server/v1/persistence/account';

jest.mock('../../src/server/v1/transaction/read.js', () => ({
  readTransaction: jest.fn(),
}));

jest.mock('../../src/server/v1/rest/users/users.queries.js', () => ({
  getUserAccountsQuery: jest.fn(),
}));

const mockAccountsResponse = {
  records: [
    {
      keys: [
        'userId',
        'userName',
        'uid',
        'persona',
        'brand',
        'contactGlopid',
        'sapAccountId',
        'city',
        'state',
        'accountName',
        'sourceSystem',
        'contactSfdcId',
        'firstName',
        'lastName',
        'primaryPhone',
        'secondaryPhone',
        'primaryPhoneType',
        'secondaryPhoneType',
        'addressLine1',
        'addressLine2',
        'userCity',
        'userState',
        'zipCode',
      ],
      _fields: [
        'tim.nilles@example.com',
        'Shanel.Witting@hotmail.com',
        'cf7f48a15fb74c97a2a10318ce5b30fa',
        'dealer',
        'national',
        'a58a9c92-63e8-4000-8b03-39963b88f846',
        '0003552195',
        'BALTIC',
        'SD',
        'CHS BALTIC',
        'P08',
        null,
        'Carroll',
        'Tester',
        '3145551212',
        '',
        null,
        null,
        '123 Bayer Parkway',
        '',
        'Saint Louis',
        'MO',
        '63111',
      ],
      _fieldLookup: {
        userId: 0,
        userName: 1,
        uid: 2,
        persona: 3,
        brand: 4,
        contactGlopid: 5,
        sapAccountId: 6,
        city: 7,
        state: 8,
        accountName: 9,
        sourceSystem: 10,
        contactSfdcId: 11,
        firstName: 12,
        lastName: 13,
        primaryPhone: 14,
        secondaryPhone: 15,
        primaryPhoneType: 16,
        secondaryPhoneType: 17,
        addressLine1: 18,
        addressLine2: 19,
        userCity: 20,
        userState: 21,
        zipCode: 22,
      },
    },
    {
      keys: [
        'userId',
        'userName',
        'uid',
        'persona',
        'brand',
        'contactGlopid',
        'sapAccountId',
        'city',
        'state',
        'accountName',
        'sourceSystem',
        'contactSfdcId',
        'firstName',
        'lastName',
        'primaryPhone',
        'secondaryPhone',
        'primaryPhoneType',
        'secondaryPhoneType',
        'addressLine1',
        'addressLine2',
        'userCity',
        'userState',
        'zipCode',
      ],
      _fields: [
        'tim.nilles@example.com',
        'Shanel.Witting@hotmail.com',
        'cf7f48a15fb74c97a2a10318ce5b30fa',
        'dealer',
        'national',
        'a58a9c92-63e8-4000-8b03-39963b88f846',
        '0003551314',
        'CLINTON',
        'MN',
        'CHS BORDER STATES CLINTON HQ',
        'P08',
        null,
        'Carroll',
        'Tester',
        '3145551212',
        '',
        null,
        null,
        '123 Bayer Parkway',
        '',
        'Saint Louis',
        'MO',
        '63111',
      ],
      _fieldLookup: {
        userId: 0,
        userName: 1,
        uid: 2,
        persona: 3,
        brand: 4,
        contactGlopid: 5,
        sapAccountId: 6,
        city: 7,
        state: 8,
        accountName: 9,
        sourceSystem: 10,
        contactSfdcId: 11,
        firstName: 12,
        lastName: 13,
        primaryPhone: 14,
        secondaryPhone: 15,
        primaryPhoneType: 16,
        secondaryPhoneType: 17,
        addressLine1: 18,
        addressLine2: 19,
        userCity: 20,
        userState: 21,
        zipCode: 22,
      },
    },
  ],
};

describe('Accounts Persistence', () => {
  it('fetch accounts for given federationId not in shadow mode', async () => {
    const query = 'query';
    const user = {
      federationId: 'cf7f48a15fb74c97a2a10318ce5b30fr',
      shadow: false,
    };
    const scopes = [];
    getUserAccountsQuery.mockReturnValue(query);
    readTransaction.mockReturnValue(Promise.resolve(mockAccountsResponse));

    const [error, userWithAccounts] = await to(Test.fetchUserWithAccountsByFederationId(user, scopes));
    expect(error).toBeNull();
    expect(userWithAccounts).not.toBeNull();
    expect(userWithAccounts.accounts.length).toEqual(2);
    expect(userWithAccounts.accounts[0]).toMatchObject({
      sapAccountId: '0003552195',
      city: 'BALTIC',
      state: 'SD',
      accountName: 'CHS BALTIC',
      uid: '0003552195',
      brands: ['NB'],
      sourceSystem: 'P08',
    });
    expect(userWithAccounts.userName).toEqual('Shanel.Witting@hotmail.com');
    expect(userWithAccounts.uid).toEqual('a58a9c92-63e8-4000-8b03-39963b88f846');
    expect(userWithAccounts.shadow).toEqual(undefined);
    expect(userWithAccounts.userType).toEqual('DEALER');
    expect(userWithAccounts.userId).toEqual('tim.nilles@example.com');
    expect(readTransaction).toBeCalledWith(query);
    expect(getUserAccountsQuery).toBeCalledWith(user.federationId, scopes);
  });

  it('fetch accounts for given federationId in shadow mode', async () => {
    const query = 'query';
    const user = {
      federationId: 'cf7f48a15fb74c97a2a10318ce5b30fr',
      shadow: true,
    };
    // this is not testing whether the scopes filter the accounts, just testing for the presence of scopes
    const combinations = [{
      brand: 'national',
      persona: 'dealer',
      country: 'US',
      lob: 'seed',
    }]
    getUserAccountsQuery.mockReturnValue(query);
    readTransaction.mockReturnValue(Promise.resolve(mockAccountsResponse));

    const [error, userWithAccounts] = await to(Test.fetchUserWithAccountsByFederationId(user, combinations));
    expect(error).toBeNull();
    expect(userWithAccounts).not.toBeNull();
    expect(userWithAccounts.accounts.length).toEqual(2);
    expect(userWithAccounts.shadow.federationId).toEqual('cf7f48a15fb74c97a2a10318ce5b30fr');
    expect(userWithAccounts.accounts[0]).toMatchObject({
      sapAccountId: '0003552195',
      city: 'BALTIC',
      state: 'SD',
      accountName: 'CHS BALTIC',
      uid: '0003552195',
      brands: ['NB'],
    });
    expect(userWithAccounts.userName).toEqual('Shanel.Witting@hotmail.com');
    expect(userWithAccounts.uid).toEqual('a58a9c92-63e8-4000-8b03-39963b88f846');
    expect(userWithAccounts.userType).toEqual('DEALER');
    expect(userWithAccounts.userId).toEqual('tim.nilles@example.com');
    expect(readTransaction).toBeCalledWith(query);
    expect(getUserAccountsQuery).toBeCalledWith(user.federationId, combinations);
  });

  it('rejects when error fetching data from neo4j', async () => {
    const query = 'query';
    const user = {
      federationId: 'cf7f48a15fb74c97a2a10318ce5b30fv',
      shadow: true,
    };
    getUserAccountsQuery.mockReturnValue(query);
    readTransaction.mockReturnValue(Promise.reject(new Error('data not found')));
    const [error] = await to(Test.fetchUserWithAccountsByFederationId(user));
    expect(error.message).toEqual('Failed to read accounts data from Neo4j; data not found');
  });
});
