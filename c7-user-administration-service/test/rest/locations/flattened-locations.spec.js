import getLobsFromHqSapId from '../../../src/server/v1/rest/locations/locations.persistence';
import { getLocations } from '../../../src/server/v1/locations/location.service.utils';

jest.mock('../../../src/server/v1/locations/location.service.utils.ts', () => ({
  getLocations: jest.fn(),
}));

describe('Locations Persistence', () => {
  it('returns empty array when hq has no lob accounts', async () => {
    const accounts = [];
    const mockHybrisResponse = getMockHybrisLocationHierarchyResponse(accounts);
    getLocations.mockReturnValue(Promise.resolve(mockHybrisResponse));
    const res = await getLobsFromHqSapId('mock-hq-sap-id');
    expect(res.length).toBe(0);
  });

  it('flattens location hierarchy response with undefined children from hybris correctly', async () => {
    const hqSapId = '1013083';
    const accounts = [
      createAccount('SEED', hqSapId),
      createAccount(
        'BIOAG',
        hqSapId,
        [
          createLocation('7777777', 2),
          createLocation('8888888', 2, [createLocation('9999999', 3)])
        ],
      ),
    ];
    const mockHybrisResponse = getMockHybrisLocationHierarchyResponse(accounts);
    getLocations.mockReturnValue(mockHybrisResponse);

    const res = await getLobsFromHqSapId(hqSapId);
    expect(res.length).toBe(4);

    const hq = res.find(location => location.id === `000${hqSapId}`);
    expect(hq.lob.length).toBe(2);
    expect(hq.lob.includes('seed') && hq.lob.includes('bioag')).toBe(true);
  });

  it('combines lobs from locations when a location is a child of multiple accounts', async () => {
    const hqSapId = '1013083';
    const sapIds = ['0000000', '1111111', '2222222', '3333333'];
    const expectedLocationLobs = {
      [sapIds[0]]: ['seed', 'bioag'],
      [sapIds[1]]: ['seed', 'bioag'],
      [sapIds[2]]: ['bioag', 'cp'],
      [sapIds[3]]: ['bioag'],
      [hqSapId]: ['seed', 'bioag', 'cp'],
    };

    const accounts = [
      createAccount(
        'SEED',
        hqSapId,
        [
          createLocation(sapIds[0], 2),
          createLocation(sapIds[1], 2),
        ],
      ),
      createAccount(
        'BIOAG',
        hqSapId,
        [
          createLocation(sapIds[2], 2),
          createLocation(sapIds[1], 2, [createLocation(sapIds[0], 3), createLocation(sapIds[3], 3)])
        ],
      ),
      createAccount('CP', hqSapId, [createLocation(sapIds[2], 2)]),
    ];

    const mockHybrisResponse = getMockHybrisLocationHierarchyResponse(accounts);
    getLocations.mockReturnValue(mockHybrisResponse);

    const res = await getLobsFromHqSapId(hqSapId);
    expect(res.length).toBe(Object.keys(expectedLocationLobs).length);

    res.forEach(location => {
      expect(location.lob.length).toBe(expectedLocationLobs[location.id.substring(3)].length);
    });
  });
});

function createAccount(lob, sapAccountId, children) {
  return {
    key: lob,
    value: {
      accountName: 'MOCK ACCOUNT NAME',
      accountType: 'distributor',
      address: [],
      children,
      level: 1,
      sapAccountId,
      sapGlopid: 'cf2b5a0d-0040-44c6-8e3c-4ac3d765686d',
    },
  };
}

function createLocation(sapAccountId, level, children = undefined) {
  return {
    accountName: 'MOCK ACCOUNT NAME',
    address: [],
    children,
    level,
    sapAccountId,
    sapGlopid: 'cf2b5a0d-0040-44c6-8e3c-4ac3d765686d',
  };
}

function getMockHybrisLocationHierarchyResponse(accounts) {
  const mock = {
    data: {
      accounts,
    },
  };
  return mock;
}
