import {
  getUsersLocationHierarchy,
  flattenLocations,
} from '../../src/server/v1/locations';
import getFlattentedUsersLocationHierarchy
  from '../../src/server/v1/locations/location.hierarchy.service.utils';


jest.mock('../../src/server/v1/locations', () => ({
  getUsersLocationHierarchy: jest.fn(),
  flattenLocations: jest.fn(),
}));

describe('locations', () => {
  it('getFlattentedUsersLocationHierarchy when user is admin for multiple locations', async () => {
    const sampleData = [[
      {
        name: 'B Location',
        accountType: 'Distributor',
        address: [
          {
            addressLine1: '1701 N TOWANDA AVE',
            city: 'BLOOMINGTON',
            country: 'United States',
            state: 'IL',
            type: 'MAILING',
            zip: '61701-2057',
          },
        ],
        children: [
          {
            name: 'D Location',
            accountType: 'Retailer',
            address: [
              {
                addressLine1: '1380 PERRY RD',
                city: 'PLAINFIELD',
                country: 'United States',
                state: 'IN',
                type: 'MAILING',
                zip: '46168-7654',
              },
            ],
            level: 'Division',
            id: 'D',
            lob: [
              'SEED', 'CP',
            ],
            sapGlopid: '61997bcc-a7f9-42ae-8ad8-9d33b51e733b',
          },
        ],
        level: 'Region',
        id: 'B',
        lob: [
          'SEED', 'CP',
        ],
      },
    ]];

    const sampleFlatData = [{
      id: 'B',
      level: 'Region',
      name: 'B Location',
      lob: ['seed'],
      parentID: 0,
    },
    {
      id: 'C',
      level: 'Region',
      name: 'C Location',
      lob: ['seed'],
      parentID: 0,
    },
    {
      id: 'C',
      level: 'Region',
      name: 'C Location',
      lob: ['cp'],
      parentID: 0,
    },
    {
      id: 'D',
      level: 'Division',
      name: 'D Location',
      lob: ['seed'],
      parentID: 'B',
    },
    {
      id: 'G',
      level: 'Division',
      name: 'G Location',
      lob: ['seed'],
      parentID: 'C',
    }];

    const expected = [
      {
        id: 'B',
        level: 'Region',
        name: 'B Location',
        lob: ['seed'],
        parentID: 0,
      },
      {
        id: 'C',
        level: 'Region',
        name: 'C Location',
        lob: ['seed', 'cp'],
        parentID: 0,
      },
      {
        id: 'D',
        level: 'Division',
        name: 'D Location',
        lob: ['seed'],
        parentID: 'B',
      },
      {
        id: 'G',
        level: 'Division',
        name: 'G Location',
        lob: ['seed'],
        parentID: 'C',
      },
    ];
    getUsersLocationHierarchy.mockReturnValue(sampleData);
    flattenLocations.mockReturnValue(sampleFlatData);
    const actual = await getFlattentedUsersLocationHierarchy('john1');
    expect(actual).toEqual(expected);
  });
});
