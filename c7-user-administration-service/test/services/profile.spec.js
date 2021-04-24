import Record from 'neo4j-driver/lib/v1/record';
import { readTransaction } from '../../src/server/v1/neo4j.utils';
import { getProfileByUserIdService, getProfileByFederationIdService } from '../../src/server/v1/rest/users/users.persistence';

jest.mock('../../src/server/v1/neo4j.utils', () => ({
  readTransaction: jest.fn(),
}));

describe('user profile', () => {
  it('returns not found 404 response on empty db result for profile query by user id', () => {
    const mockUserId = 'abcde123';
    const mockBrand = 'national';
    const mockPersona = 'dealer';
    const mockDbResult = {
      records: [],
      summary: {},
      statementType: 'r',
    };
    readTransaction.mockReturnValue(mockDbResult);

    return getProfileByUserIdService(mockUserId, mockBrand, mockPersona)
      .then(
        resp => {
          expect(resp.status).toEqual(404);
          expect(resp.message).toEqual(`User profile with userId ${mockUserId}, brand ${mockBrand}, and persona ${mockPersona} could not be found.`);
        },
      );
  });

  it('returns not found 404 response on empty db result for profile query by federation id', () => {
    const mockUserFedId = '1234-5678-9876';
    const mockBrand = 'national';
    const mockPersona = 'dealer';
    const mockDbResult = {
      records: [],
      summary: {},
      statementType: 'r',
    };
    readTransaction.mockReturnValue(mockDbResult);

    return getProfileByFederationIdService(mockUserFedId, mockBrand, mockPersona)
      .then(
        resp => {
          expect(resp.status).toEqual(404);
          expect(resp.message).toEqual(`User profile with federationId ${mockUserFedId} could not be found.`);
        },
      );
  });

  it('returns not found 404 response on empty db result', () => {
    const mockUserId = 'abcde123';
    const mockBrand = 'national';
    const mockPersona = 'dealer';
    const mockDbResult = {
      records: [],
      summary: {},
      statementType: 'r',
    };
    readTransaction.mockReturnValue(mockDbResult);

    return getProfileByUserIdService(mockUserId, mockBrand, mockPersona)
      .then(
        resp => {
          expect(resp.status).toEqual(404);
          expect(resp.message).toEqual(`User profile with userId ${mockUserId}, brand ${mockBrand}, and persona ${mockPersona} could not be found.`);
        },
      );
  });

  it('returns found 200 on successful db result', () => {
    const mockUserId = 'applesauce@gmail.com';
    const mockBrand = 'national';
    const mockPersona = 'dealer';
    const mockSapId = '000123456';
    const mockDbResult = {
      records: [
        new Record(['userId', 'firstName', 'primaryPhone', 'sapId'], [mockUserId, 'Alice', null, mockSapId]),
      ],
      summary: {},
      statementType: 'r',
    };
    readTransaction.mockReturnValue(mockDbResult);

    return getProfileByUserIdService(mockUserId, mockBrand, mockPersona)
      .then(
        resp => {
          expect(resp.status).toEqual(200);
          expect(resp.message).toEqual('User profile was found.');
        },
      );
  });

  it('returns correct user information on successful db result', () => {
    const mockUserId = 'applesauce@gmail.com';
    const mockBrand = 'national';
    const mockPersona = 'dealer';
    const mockFirstName = 'Alice';
    const mockLastName = 'Abana';
    const mockPrimaryPhone = '111-111-1111';
    const mockSecondary = '222-222-2222';
    const mockAddress1 = '800 Monsanto Drive';
    const mockAddress2 = 'Conjunction Junction';
    const mockCity = 'St. Louis';
    const mockState = 'MO';
    const mockZip = '63303';
    const mockSapId = '000123456';
    const mockRoles = [{
      labels: ['Role'],
      properties: {
        name: 'Admin',
        id: 'glb:seed:ad',
        lob: 'seed',
        scope: 'global',
      },
    }];
    const mockDbResult = {
      records: [
        new Record(
          ['userId', 'firstName', 'lastName', 'primaryPhone', 'secondaryPhone', 'address1', 'address2', 'city', 'state', 'zip', 'sapAccountIds', 'roles'],
          [mockUserId, mockFirstName, mockLastName, mockPrimaryPhone, mockSecondary, mockAddress1, mockAddress2, mockCity, mockState, mockZip, [mockSapId], mockRoles],
        ),
      ],
      summary: {},
      statementType: 'r',
    };
    readTransaction.mockReturnValue(mockDbResult);

    return getProfileByUserIdService(mockUserId, mockBrand, mockPersona)
      .then(
        resp => {
          expect(resp.status).toEqual(200);
          expect(resp.data.userId).toEqual(mockUserId);
          expect(resp.data.firstName).toEqual(mockFirstName);
          expect(resp.data.primaryPhone).toEqual(mockPrimaryPhone);
          expect(resp.data.sapAccountIds[0]).toEqual('123456');
          expect(resp.data.roles.length).toEqual(1);
        },
      );
  });
});
