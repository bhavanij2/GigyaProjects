import * as entitlements from '../../src/server/v1/entitlements';

const {
  getUsersWithRolesByLocation,
  getLocation,
} = entitlements;

const entitlementsAddUserRole = entitlements.addUserRole;
const entitlementsDeleteUserRole = entitlements.deleteUserRole;

import {
  addUserRoleService,
  deleteUserRoleService,
  editUserRoleService,
  getUserRolesService as getUserRoles,
  getUserApplicationEntitlements,
  getUserEntitlements,
  getUserEntitlementsUserProfileService as getUserEntitlementsUserProfile,
  getAccountsByFedIdService as getAccountsByFedId,
} from '../../src/server/v1/rest/users/users.persistence';

import {
  readTransaction,
  writeTransaction,
  writeListTransaction,
} from '../../src/server/v1/neo4j.utils';

import {
  getUsersWithRolesByLocationQuery,
  getLocationQuery,
} from '../../src/server/v1/queries.util';

import {
  addUserRoleQuery,
  deleteUserRoleQuery,
  editUserRoleQuery,
  getUserEntitlementsQuery,
  getHqSapIdQuery,
  getUserApplicationEntitlementsQuery,
  getUserEntitlementsUserProfileQuery,
  getUserAccountsQuery,
  getUserRolesQuery,
} from '../../src/server/v1/rest/users/users.queries';

import { getLocationInfo } from '../../src/server/v1/locations';
import {
  getExistingSapId,
  existingLocationResult,
  createUserLocationObj,
  createUserObj,
} from '../../src/server/v1/entitlements/entitlements.util';
import {
  sendAuditMessage,
  syncNewUserToCu360,
} from '../../src/server/sqs.utils';

jest.mock('../../src/server/v1/entitlements/entitlements.util', () => ({
  getExistingSapId: jest.fn(),
  existingLocationResult: jest.fn(),
  createUserLocationObj: jest.fn(),
  createUserObj: jest.fn(),
}));

jest.mock('../../src/server/v1/neo4j.utils', () => ({
  readTransaction: jest.fn(),
  writeTransaction: jest.fn(),
  writeListTransaction: jest.fn(),
}));

jest.mock('../../src/server/v1/queries.util', () => ({
  getUsersWithRolesByLocationQuery: jest.fn(),
  addUserRoleQuery: jest.fn(),
  deleteUserRoleQuery: jest.fn(),
  editUserRoleQuery: jest.fn(),
  getLocationQuery: jest.fn(),
}));

jest.mock('../../src/server/v1/rest/users/users.queries', () => ({
  getUserEntitlementsQuery: jest.fn(),
  getUserRolesQuery: jest.fn(),
  getHqSapIdQuery: jest.fn(),
  getUserApplicationEntitlementsQuery: jest.fn(),
  getUserEntitlementsUserProfileQuery: jest.fn(),
  getUserAccountsQuery: jest.fn(),
}));

jest.mock('../../src/server/v1/locations', () => ({
  getLocationInfo: jest.fn(),
}));


jest.mock('../../src/server/sqs.utils', () => ({
  sqs: jest.fn(),
  sendSqsMessage: jest.fn(),
  sendAuditMessage: jest.fn(),
  syncNewUserToCu360:jest.fn(),
}));

const MOCK_DATE = new Date();
global.Date = jest.fn(() => MOCK_DATE);
global.Date.toUTC = jest.fn(() => MOCK_DATE.toUTCString());

describe('user entitlements', () => {
  it('getUserRoles gets roles for a user', async () => {
    const result = {
      records: [
        {
          keys: [
            'userId',
            'userName',
            'sapAccountId',
            'sapAccountName',
            'roleId',
            'roleName',
            'lob',
          ],
          _fields: [
            'john1',
            'john',
            '1000201',
            'St peters',
            'glb:seed:fin',
            'Finance Manager',
            'seed',
          ],
        },
        {
          keys: [
            'userId',
            'userName',
            'sapAccountId',
            'sapAccountName',
            'roleId',
            'roleName',
            'lob',
          ],
          _fields: [
            'john1',
            'john',
            '1000201',
            'St peters',
            'glb:cp:fin',
            'Finance Manager',
            'cp',
          ],
        },
        {
          keys: [
            'userId',
            'userName',
            'sapAccountId',
            'sapAccountName',
            'roleId',
            'roleName',
            'lob',
          ],
          _fields: [
            'john1',
            'john',
            '1000201',
            'St peters',
            'glb:cp:om',
            'Order Manager',
            'cp',
          ],
        },
      ],
    };
    const federationId = 'john1';

    const queryResult = `
    MATCH (u:User {id: "${federationId}"})-[assignment:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id: assignment.id})
    RETURN u.id as userId, u.name as userName, l.sapid as sapAccountId,
    l.name as sapAccountName, r.id as roleId, r.name as roleName, r.lob as lob`;

    getUserRolesQuery.mockReturnValue(queryResult);
    readTransaction.mockReturnValue(result);

    const actual = await getUserRoles('john1');
    const expected = [
      {
        userId: 'john1',
        userName: 'john',
        sapAccountId: '1000201',
        sapAccountName: 'St peters',
        roleName: 'Finance Manager',
        lobIdArray: [
          {
            lob: 'seed',
            roleId: 'glb:seed:fin',
          },
          {
            lob: 'cp',
            roleId: 'glb:cp:fin',
          },
        ],
      },
      {
        userId: 'john1',
        userName: 'john',
        sapAccountId: '1000201',
        sapAccountName: 'St peters',
        roleName: 'Order Manager',
        lobIdArray: [
          {
            lob: 'cp',
            roleId: 'glb:cp:om',
          },
        ],

      },
    ];
    expect(actual).toEqual(expected);
  });

  it('addUserRole adds a new user role', async () => {
    const req = {
      body: {
        userId: 1,
        sapAccountId: 1,
        roleName: 'Finance Manager',
        lobList: ['cp', 'seed'],
      },
    };
    const locationInfo = {
      locationName: 'CHS INC RUTHTON MN', // shortName
      streetAddress: '1780 221ST STREET', // cleansed address
      city: 'RUTHTON',
      state: 'MN',
      zipCode: '56170',
      hqSapId: '0001775005',
      payer: false,
    };

    const result = 'SUCCESS';
    jest.spyOn(entitlements, 'getLocation').mockImplementationOnce(() => Promise.resolve(locationInfo));

    writeListTransaction.mockReturnValueOnce(result);

    const actual = await addUserRoleService(req.body);

    expect(writeListTransaction).toHaveBeenLastCalledWith(addUserRoleQuery, { ...req.body, ...locationInfo }, req.body.lobList);
    const expected = { code: '201', message: 'The relationship was successfully created.' };
    expect(actual).toEqual(expected);
  });

  it('getUsersWithRolesByLocation gets users by location', async () => {
    const result = {
      records: [
        {
          keys: [
            'userId',
            'userName',
            'sapAccountId',
            'sapAccountName',
            'roleId',
            'roleName',
            'lob',
          ],
          _fields: [
            'john1',
            'john',
            '1000201',
            'St peters',
            'glb:seed:fin',
            'Finance Manager',
            'seed',
          ],
        },
        {
          keys: [
            'userId',
            'userName',
            'sapAccountId',
            'sapAccountName',
            'roleId',
            'roleName',
            'lob',
          ],
          _fields: [
            'john1',
            'john',
            '1000201',
            'St peters',
            'glb:cp:fin',
            'Finance Manager',
            'cp',
          ],
        },
        {
          keys: [
            'userId',
            'userName',
            'sapAccountId',
            'sapAccountName',
            'roleId',
            'roleName',
            'lob',
          ],
          _fields: [
            'john1',
            'john',
            '1000201',
            'St peters',
            'glb:cp:om',
            'Order Manager',
            'cp',
          ],
        },
      ],
    };

    const sapAccountId = '1000201';

    const queryResult = `
    MATCH (u:User)-[e:HAS_ROLE]->(l:Location { sapid: "${sapAccountId}" })
    MATCH (r:Role {id: e.id})
    RETURN u.id as userId, u.name as userName, l.sapid as sapAccountId,
    l.name as sapAccountName, r.id as roleId, r.name as roleName, r.lob as lob`;

    getUsersWithRolesByLocationQuery.mockReturnValue(queryResult);
    readTransaction.mockReturnValue(result);

    const actual = await getUsersWithRolesByLocation('1000201');
    const expected = [
      {
        userId: 'john1',
        userName: 'john',
        sapAccountId: '1000201',
        sapAccountName: 'St peters',
        roleName: 'Finance Manager',
        lobIdArray: [
          {
            lob: 'seed',
            roleId: 'glb:seed:fin',
          },
          {
            lob: 'cp',
            roleId: 'glb:cp:fin',
          },
        ],
      },
      {
        userId: 'john1',
        userName: 'john',
        sapAccountId: '1000201',
        sapAccountName: 'St peters',
        roleName: 'Order Manager',
        lobIdArray: [
          {
            lob: 'cp',
            roleId: 'glb:cp:om',
          },
        ],

      },
    ];
    expect(actual).toEqual(expected);
  });

  it('deleteUserRole returns an error', async done => {
    const req = {
      body: {
        userId: 1,
        sapAccountId: 1,
        roleName: 'Finance Manager',
        lobList: ['cp', 'seed'],
      },
    };
    try {
      writeListTransaction.mockImplementationOnce(() => new Promise((resolve, reject) => {
        reject(new Error('Neo4jError: Node(52) already exists with label User and property id'));
      }));
      await deleteUserRoleService(req.body);
    }
    catch (error) {
      expect(writeListTransaction).toHaveBeenLastCalledWith(deleteUserRoleQuery, req.body, req.body.lobList);
      expect(error).toEqual(new Error('Neo4jError: Node(52) already exists with label User and property id'));
      done();
    }
  });

  it('deleteUserRole returns code 200 if the relationship was successfully deleted', async () => {
    const req = {
      body: {
        userId: 1,
        sapAccountId: 1,
        roleName: 'Finance Manager',
        lobList: ['cp', 'seed'],
      },
    };

    const result = 'SUCCESS';

    writeListTransaction.mockReturnValue(result);

    const actual = await deleteUserRoleService(req.body);
    expect(writeListTransaction).toHaveBeenLastCalledWith(deleteUserRoleQuery, req.body, req.body.lobList);

    const expected = { code: '200', message: 'The relationship was successfully deleted.' };
    expect(actual).toEqual(expected);
  });

  it('editUserRole returns code 200 if the relationship was successfully updated', async () => {
    const req = {
      body: {
        lob: 'seed',
        newRole: {
          roleName: 'Site Manager',
          locationId: '0003551260',
          lob: 'cp',
        },
      },
      params: {
        federationId: 'f3dabea4ffcb4b35a3040e213b0c7501',
        roleName: 'Admin',
        locationId: '0003552210',
      },
    };

    const result = 'SUCCESS';
    const LOCATION_INFO = {
      locationName: 'CHS INC RUTHTON MN', // shortName
      streetAddress: '1780 221ST STREET', // cleansed address
      city: 'RUTHTON',
      state: 'MN',
      zipCode: '56170',
      hqSapId: '0001775005',
      payer: false,
    };

    const { lob, newRole } = req.body;
    const { federationId, ...role } = req.params;

    writeTransaction.mockReturnValue(result);
    jest.spyOn(entitlements, 'getLocation').mockImplementationOnce(() => Promise.resolve(LOCATION_INFO));
    const oldRole = {
      ...role,
      lob,
    };

    const actual = await editUserRoleService(federationId, oldRole, newRole);
    expect(writeTransaction).toHaveBeenLastCalledWith(editUserRoleQuery, {
      info: { federationId, ...LOCATION_INFO },
      oldRole: { ...role, lob },
      newRole,
    });
    const expected = { code: '200', message: 'The relationship was successfully updated' };
    expect(actual).toEqual(expected);
  });

  it('getUserEntitlements gets users entitlements', async () => {
    const result = {
      records: [
        {
          keys: [
            'userId',
            'sapAccountId',
            'permissionType',
            'action',
            'pid',
          ],
          _fields: [
            'john1',
            '1000201',
            'write',
            'inventory',
            'glb:seed:fin',
          ],
        },
        {
          keys: [
            'userId',
            'sapAccountId',
            'permissionType',
            'action',
            'pid',
          ],
          _fields: [
            'john1',
            '1000201',
            'write',
            'inventory',
            'glb:seed:fin',
          ],
        },
        {
          keys: [
            'userId',
            'sapAccountId',
            'permissionType',
            'action',
            'pid',
          ],
          _fields: [
            'john1',
            '1000202',
            'write',
            'inventory',
            'glb:seed:fin',
          ],
        },
      ],
    };
    const userId = 'john1';
    const queryResult = `
    MATCH (u:User {id: "${userId}"})-[assignment:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id: assignment.id})-[permission:HAS_PERMISSION]->(p:Permission)
    RETURN u.id as userId, l.sapid as sapAccountId, permission.type as permissionType, p.action as action, p.id as pid`;

    getUserEntitlementsQuery.mockReturnValue(queryResult);
    readTransaction.mockReturnValue(result);
    const actual = await getUserEntitlements(userId);
    const expected = { 1000201: ['glb:seed:fin:write', 'glb:seed:fin:write'], 1000202: ['glb:seed:fin:write'] };
    expect(actual).toEqual(expected);
  });

  it('getUserEntitlementsUserProfile gets users entitlements', async () => {
    const result = {
      records: [
        {
          keys: [
            'userId',
            'sapAccountId',
            'permissionType',
            'action',
            'pid',
          ],
          _fields: [
            'john1',
            '1000201',
            'write',
            'inventory',
            'glb:seed:fin',
          ],
        },
        {
          keys: [
            'userId',
            'sapAccountId',
            'permissionType',
            'action',
            'pid',
          ],
          _fields: [
            'john1',
            '1000201',
            'write',
            'inventory',
            'glb:seed:fin',
          ],
        },
        {
          keys: [
            'userId',
            'sapAccountId',
            'permissionType',
            'action',
            'pid',
          ],
          _fields: [
            'john1',
            '1000202',
            'write',
            'inventory',
            'glb:seed:fin',
          ],
        },
      ],
    };

    const username = '1022461';
    const brand = 'national';
    const userType = 'dealer';
    const queryResult = `
    MATCH (u:User {id: "${username}", brand: "${brand}", persona: "${userType}"})-[assignment:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id: assignment.id})-[permission:HAS_PERMISSION]->(p:Permission)
    RETURN u.id as userId, l.sapid as sapAccountId, permission.type as permissionType, p.action as action, p.id as pid`;

    getUserEntitlementsUserProfileQuery.mockReturnValue(queryResult);
    readTransaction.mockReturnValue(result);
    const actual = await getUserEntitlementsUserProfile(username, brand, userType);
    const expected = { 1000201: ['glb:seed:fin:write', 'glb:seed:fin:write'], 1000202: ['glb:seed:fin:write'] };
    expect(actual).toEqual(expected);
  });

  it('getUserApplicationEntitlements gets users entitlements', async () => {
    const result = {
      records: [
        {
          keys: [
            'userId',
            'sapAccountId',
            'permissionType',
            'action',
            'application',
            'lob',
            'pid',
          ],
          _fields: [
            'john1',
            '1000202',
            'write',
            'users',
            'user-admin',
            'seed',
            'glb:seed:user-admin:users',
          ],
        },
        {
          keys: [
            'userId',
            'sapAccountId',
            'permissionType',
            'action',
            'application',
            'lob',
            'pid',
          ],
          _fields: [
            'john1',
            '1000201',
            'write',
            'users',
            'user-admin',
            'cp',
            'glb:cp:user-admin:users',
          ],
        },
      ],
    };
    const userId = 'john1';
    const application = 'user-admin';

    const queryResult = `
    MATCH (u:User {id: "${userId}"})-[assignment:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id: assignment.id})-[permission:HAS_PERMISSION]->(p:Permission {application: "${application}"})
    RETURN u.id as userId, l.sapid as sapAccountId, permission.type as permissionType, p.action as action, p.id as pid`;

    getUserApplicationEntitlementsQuery.mockReturnValue(queryResult);
    readTransaction.mockReturnValue(result);
    const actual = await getUserApplicationEntitlements(userId, application);
    const expected = { 1000201: ['glb:cp:user-admin:users:write'], 1000202: ['glb:seed:user-admin:users:write'] };
    expect(actual).toEqual(expected);
  });

  // describe('updateUserData', () => {
  //   it('updateUserData updates user data', async () => {
  //     const req = {
  //       params: {
  //         userId: 1,
  //         brand: 'national',
  //         persona: 'dealer',
  //       },
  //       body: {
  //         first_name: 'Dave',
  //       },
  //     };

  //     const result = 'SUCCESS';

  //   writeTransaction.mockReturnValueOnce(result);
  //   const actual = await updateUserData(req.params.userId, req.params.brand, req.params.persona, req.body);

  //   expect(writeTransaction).toHaveBeenLastCalledWith(updateUserDataQuery, { userProperties: req.body, ...req.params });
  //   const expected = 'SUCCESS';
  //   expect(actual).toEqual(expected);
  // });

  // it('updateUserData updates user data with server time', async () => {
  //   const BASE_BODY = {
  //     first_name: 'Dave',
  //   };
  //   const req = {
  //     params: {
  //       userId: 1,
  //       brand: 'national',
  //       persona: 'dealer',
  //     },
  //     body: {
  //       ...BASE_BODY,
  //       updateTimestamp: true,
  //     },
  //   };

  //     const result = 'SUCCESS';

  //     writeTransaction.mockReturnValueOnce(result);
  //     const actual = await updateUserData(req.params.userId, req.params.brand, req.params.persona, req.body);
  //     expect(writeTransaction).toHaveBeenLastCalledWith(updateUserDataQuery, {
  //       userProperties: { ...BASE_BODY, lastLogin: MOCK_DATE.toUTCString() },
  //       ...req.params,
  //     });
  //     const expected = 'SUCCESS';
  //     expect(actual).toEqual(expected);
  //   });
  // });
});

it('getAccounts gets users accounts', async () => {
  const result = {
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
          'contactSfdcId',
        ],
        _fields: [
          'john1',
          'John',
          'khad',
          'DEALER',
          'national',
          'hybrisuid1',
          '1000202',
          'st louis',
          'missouri',
          'monsanto co',
          'sfdc1234',
        ],
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
          'contactSfdcId',
        ],
        _fields: [
          'john1',
          'John',
          'khad',
          'DEALER',
          'national',
          'hybrisuid1',
          '1000203',
          'chesterfield',
          'missouri',
          'monsanto co sub',
          'sfdc5678',
        ],
      },
    ],
  };
  const userId = 'john1';

  const queryResult = `
  MATCH (u:User {id: "${userId}"})-[assignment:HAS_ROLE]->(l:Location)
  RETURN u.id as userId, u.name as userName, u.federationId as uid, u.persona as persona, u.brand as brand, l.sapid as sapAccountId, l.city as city, l.state as state, l.name as accountName,
  u.contactSfdcId as contactSfdcId`;

  getUserAccountsQuery.mockReturnValue(queryResult);
  readTransaction.mockReturnValue(result);
  const actual = await getAccountsByFedId(userId);
  const expected = {"accounts": [{"accountName": "monsanto co", "brands": ["NB"], "city": "st louis", "sapAccountId": "1000202", "state": "missouri", "uid": "1000202"}, {"accountName": "monsanto co sub", "brands": ["NB"], "city": "chesterfield", "sapAccountId": "1000203", "state": "missouri", "uid": "1000203"}], "glopid": "hybrisuid1", "mimeType": "image/jpeg", "userName": "John", "uid": "hybrisuid1", "userType": "DEALER", federationId: "khad", "contactSfdcId": "sfdc1234", "firstName": "", "lastName": "", "primaryPhone": "", "secondaryPhone": "", "primaryPhoneType": "", "secondaryPhoneType": "", "addressLine1": "", "addressLine2": "", "city": "", "state": "", "status": "", "zipCode": ""}; //eslint-disable-line
  expect(actual).toEqual(expected);
});

it('getAccounts gets users accounts', async () => {
  const result = {
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
        ],
        _fields: [
          'john1',
          'John',
          'khad',
          'DEALER',
          'national',
          'hybrisuid1',
          '1000202',
          'st louis',
          'missouri',
          'monsanto co',
        ],
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
        ],
        _fields: [
          'john1',
          'John',
          'khad',
          'DEALER',
          'national',
          'hybrisuid1',
          '1000202',
          'st louis',
          'missouri',
          'monsanto co',
        ],
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
        ],
        _fields: [
          'john1',
          'John',
          'khad',
          'DEALER',
          'national',
          'hybrisuid1',
          '1000203',
          'chesterfield',
          'missouri',
          'monsanto co sub',
        ],
      },
    ],
  };
  const userId = 'john1';

  const queryResult = `
  MATCH (u:User {id: "${userId}"})-[assignment:HAS_ROLE]->(l:Location)
  RETURN u.id as userId, u.name as userName, u.federationId as uid, u.persona as persona, u.brand as brand, l.sapid as sapAccountId, l.city as city, l.state as state, l.name as accountName
  u.contactSfdcId as contactSfdcId`;

  getUserAccountsQuery.mockReturnValue(queryResult);
  readTransaction.mockReturnValue(result);
  const actual = await getAccountsByFedId(userId);
  const expected = {"accounts": [{"accountName": "monsanto co", "brands": ["NB"], "city": "st louis", "sapAccountId": "1000202", "state": "missouri", "uid": "1000202"}, {"accountName": "monsanto co sub", "brands": ["NB"], "city": "chesterfield", "sapAccountId": "1000203", "state": "missouri", "uid": "1000203"}], "firstName": "", "glopid": "hybrisuid1", "lastName": "", "mimeType": "image/jpeg", "userName": "John", "uid": "hybrisuid1", "userType": "DEALER", federationId: "khad", "contactSfdcId": "", "primaryPhone": "", "secondaryPhone": "", "primaryPhoneType": "", "secondaryPhoneType": "", "addressLine1": "", "addressLine2": "", "city": "", "state": "", "status": "", "zipCode": ""}; //eslint-disable-line
  expect(actual).toEqual(expected);
});

it('get location from cache if it exists in entitlements db', async () => {
  const sapAccountId = '1022462';
  const neo4jLocation = {
    "records": [
      {
        "keys": [
          "Location"
        ],
        "length": 1,
        "_fields": [
          {
            "identity": {
              "low": 12319,
              "high": 0
            },
            "labels": [
              "Location"
            ],
            "properties": {
              "zipCode": "638691318",
              "city": "NEW MADRID",
              "streetAddress": "570 ST PAUL DR",
              "name": "HODGES SEED SERVICE LLC",
              "state": "MO",
              "hqSapId": "0003732650",
              "sapid": "0003732650"
            }
          }
        ],
        "_fieldLookup": {
          "Location": 0
        }
      }
    ]
  };
  const locationReturned = {
    "locationName": "HODGES SEED SERVICE LLC",
    "streetAddress": "570 ST PAUL DR",
    "city": "NEW MADRID",
    "state": "MO",
    "zipCode": "638691318",
    "hqSapId": "0003732650",
    "sapid": "0003732650"
  };
  const query = `
      MATCH (l:Location {sapid: "${sapAccountId}"})
      RETURN l as Location;
  `
  getLocationQuery.mockReturnValue(query);
  readTransaction.mockReturnValue(neo4jLocation);
  const result = await getLocation(sapAccountId);
  expect(result).toEqual(locationReturned);
});
