import { when } from 'jest-when';
import {
  getLocationHierarchy,
  getUsersLocationHierarchy,
  getLocationInfo,
  flattenLocations,
} from '../../src/server/v1/locations';
import {
  getLocations,
  getLocationDetails,
  getLocationPayerStatus,
  getCu360Hierarchy,
} from '../../src/server/v1/locations/location.service.utils';
import {
  getPortalParamsByPortal
} from '../../src/server/v1/locations/portal.parameters';
import { readTransaction } from '../../src/server/v1/neo4j.utils';

jest.mock('../../src/server/v1/neo4j.utils', () => ({
  readTransaction: jest.fn(),
}));

jest.mock('../../src/server/v1/locations/location.service.utils', () => ({
  getLocations: jest.fn(),
  getLocationInfo: jest.fn(),
  getLocationDetails: jest.fn(),
  getLocationPayerStatus: jest.fn(),
  getCu360Hierarchy: jest.fn(),
}));
jest.mock('../../src/server/v1/locations/portal.parameters', () => ({
  getPortalParamsByPortal: jest.fn(),
}));

describe('locations', () => {
  it('getLocationHierarchy get locations hierarchy when there are no children', async () => {
    const expected = [{
      id: '0001022461',
      level: 'HQ',
      name: 'CARLSON SEED INC',
      lob: ['cp', 'seed'],
      children: [],
    }];
    const locationResponse = {
      data: {
        accounts: [
          {
            key: 'CP',
            value: {
              accountName: 'CARLSON SEED INC',
              accountType: 'Wholesaler',
              address: [
                {
                  addressLine1: '100 MAIN STREET',
                  city: 'BLOOMINGTON',
                  country: 'United States',
                  state: 'IL',
                  type: 'MAILING',
                  zip: '61701',
                },
              ],
              level: 1,
              sapAccountId: 1022461,
              sapGlopid: '6f45534d-040f-4ed7-8ec3-e13f9d2abc29',
            },
          },
          {
            key: 'SEED',
            value: {
              accountName: 'CARLSON SEED INC',
              accountType: 'Wholesaler',
              address: [
                {
                  addressLine1: '100 MAIN STREET',
                  city: 'BLOOMINGTON',
                  country: 'United States',
                  state: 'IL',
                  type: 'MAILING',
                  zip: '61701',
                },
              ],
              level: 1,
              sapAccountId: 1022461,
              sapGlopid: '6f45534d-040f-4ed7-8ec3-e13f9d2abc29',
            },
          },
        ],
      },
    };
    getLocations.mockReturnValue(locationResponse);
    const actual = await getLocationHierarchy('1022461', ['CP', 'SEED']);
    expect(actual).toEqual(expected);
  });

  it('getLocationHierarchy get locations hierarchy when there are children', async () => {
    const expected = [
      {
        children: [
          {
            id: '0001746701',
            level: 'Region',
            name: 'GROWMARK INC JCBSN WHS PLNFLD',
            lob: ['cp', 'seed'],
            children: [],
          },
          {
            children: [
              {
                children: [
                  {
                    id: '0003399158',
                    level: 'Location',
                    name: 'DOHRN WAREHOUSE - level 4',
                    lob: ['cp', 'seed'],
                    children: [],
                  },
                ],
                id: '0003399157',
                level: 'Division',
                name: 'DOHRN WAREHOUSE',
                lob: ['cp', 'seed'],
              },
            ],
            id: '0001697849',
            level: 'Region',
            name: 'GROWMARK INC ALPHA WHS',
            lob: ['cp', 'seed'],
          },
          {
            id: '0003444447',
            level: 'Region',
            name: 'GROWMARK INC NASHVILLE WHS',
            lob: ['cp', 'seed'],
            children: [],
          },
          {
            children: [
              {
                id: '0001775005',
                level: 'Division',
                name: 'SEEDWAY INC MIFFLINBURG',
                lob: ['cp', 'seed'],
                children: [],
              },
            ],
            id: '0001774979',
            level: 'Region',
            name: 'SEEDWAY INC HQ HALL',
            lob: ['cp', 'seed'],
          },
          {
            id: '0003281927',
            level: 'Region',
            name: 'GROWMARK INC CYGNET',
            lob: ['cp', 'seed'],
            children: [],
          },
          {
            id: '0003386094',
            level: 'Region',
            name: 'GROWMARK INC CASEY',
            lob: ['cp', 'seed'],
            children: [],
          },
          {
            id: '0001828868',
            level: 'Region',
            name: 'GROWMARK INC FS RNTL WHS ALPHA',
            lob: ['cp', 'seed'],
            children: [],
          },
        ],
        id: '0001013083',
        level: 'HQ',
        name: 'GROWMARK INC HQ BLOOMINGTON',
        lob: ['cp', 'seed'],
      },
    ];
    const locationResponse = {
      data: {
        accounts: [
          {
            key: 'CP',
            value: {
              accountName: 'GROWMARK INC HQ BLOOMINGTON',
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
                  accountName: 'GROWMARK INC JCBSN WHS PLNFLD',
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
                  level: 2,
                  sapAccountId: 1746701,
                  sapGlopid: '61997bcc-a7f9-42ae-8ad8-9d33b51e733b',
                },
                {
                  accountName: 'GROWMARK INC ALPHA WHS',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '1695 US HIGHWAY 150',
                      city: 'ALPHA',
                      country: 'United States',
                      state: 'IL',
                      type: 'MAILING',
                      zip: '61413-9215',
                    },
                  ],
                  children: [
                    {
                      accountName: 'DOHRN WAREHOUSE',
                      accountType: 'Retailer',
                      address: [
                        {
                          addressLine1: '625 3RD AVENUE',
                          city: 'ROCK ISLAND',
                          country: 'United States',
                          state: 'IL',
                          type: 'MAILING',
                          zip: '61201-8351',
                        },
                      ],
                      children: [
                        {
                          accountName: 'DOHRN WAREHOUSE - level 4',
                          accountType: 'Retailer',
                          address: [
                            {
                              addressLine1: '625 3RD AVENUE',
                              city: 'ROCK ISLAND',
                              country: 'United States',
                              state: 'IL',
                              type: 'MAILING',
                              zip: '61201-8351',
                            },
                          ],
                          level: 4,
                          sapAccountId: 3399158,
                          sapGlopid: 'd4de756d-1773-4013-8d0e-ead1def81228',
                        },
                      ],
                      level: 3,
                      sapAccountId: 3399157,
                      sapGlopid: 'd4de756d-1773-4013-8d0e-ead1def81220',
                    },
                  ],
                  level: 2,
                  sapAccountId: 1697849,
                  sapGlopid: 'd2538430-5dc0-46e4-833b-c06f14128ff2',
                },
                {
                  accountName: 'GROWMARK INC NASHVILLE WHS',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '17657-B Mockingbird Road',
                      city: 'NASHVILLE',
                      country: 'United States',
                      state: 'IL',
                      type: 'MAILING',
                      zip: '62263-3422',
                    },
                  ],
                  level: 2,
                  sapAccountId: 3444447,
                  sapGlopid: 'a16fb78c-e7a6-4621-8921-235639845b90',
                },
                {
                  accountName: 'SEEDWAY INC HQ HALL',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '1734 RAILROAD PL',
                      city: 'HALL',
                      country: 'United States',
                      state: 'NY',
                      type: 'MAILING',
                      zip: '14463',
                    },
                  ],
                  children: [
                    {
                      accountName: 'SEEDWAY INC MIFFLINBURG',
                      accountType: 'Retailer',
                      address: [
                        {
                          addressLine1: '275 N EIGHTH ST',
                          city: 'MIFFLINBURG',
                          country: 'United States',
                          state: 'PA',
                          type: 'MAILING',
                          zip: '17844-8504',
                        },
                      ],
                      level: 3,
                      sapAccountId: 1775005,
                      sapGlopid: '6021fb0a-5e6d-4d14-a18e-7226e0867dca',
                    },
                  ],
                  level: 2,
                  sapAccountId: 1774979,
                  sapGlopid: '82a855d1-d2c4-4c9d-b30a-9c0c0eb42b9e',
                },
                {
                  accountName: 'GROWMARK INC CYGNET',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '12965 DEFIANCE PIKE',
                      city: 'CYGNET',
                      country: 'United States',
                      state: 'OH',
                      type: 'MAILING',
                      zip: '43413',
                    },
                  ],
                  level: 2,
                  sapAccountId: 3281927,
                  sapGlopid: '9c6ae706-6021-4972-b6fd-938d039aaf93',
                },
                {
                  accountName: 'GROWMARK INC CASEY',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '700 W MONROE AVE',
                      city: 'CASEY',
                      country: 'United States',
                      state: 'IL',
                      type: 'MAILING',
                      zip: '62420',
                    },
                  ],
                  level: 2,
                  sapAccountId: 3386094,
                  sapGlopid: '7b354b60-5507-4407-8d76-cc178a3e8cfe',
                },
                {
                  accountName: 'GROWMARK INC FS RNTL WHS ALPHA',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '1695 US HWY 150',
                      city: 'ALPHA',
                      country: 'United States',
                      state: 'IL',
                      type: 'MAILING',
                      zip: '61413-9215',
                    },
                  ],
                  level: 2,
                  sapAccountId: 1828868,
                  sapGlopid: '97da621e-6664-4a4f-8145-f965bedd9eb3',
                },
              ],
              level: 1,
              sapAccountId: 1013083,
              sapGlopid: 'cf2b5a0d-0040-44c6-8e3c-4ac3d765686d',
            },
          },
          {
            key: 'SEED',
            value: {
              accountName: 'GROWMARK INC HQ BLOOMINGTON',
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
                  accountName: 'GROWMARK INC JCBSN WHS PLNFLD',
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
                  level: 2,
                  sapAccountId: 1746701,
                  sapGlopid: '61997bcc-a7f9-42ae-8ad8-9d33b51e733b',
                },
                {
                  accountName: 'GROWMARK INC ALPHA WHS',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '1695 US HIGHWAY 150',
                      city: 'ALPHA',
                      country: 'United States',
                      state: 'IL',
                      type: 'MAILING',
                      zip: '61413-9215',
                    },
                  ],
                  children: [
                    {
                      accountName: 'DOHRN WAREHOUSE',
                      accountType: 'Retailer',
                      address: [
                        {
                          addressLine1: '625 3RD AVENUE',
                          city: 'ROCK ISLAND',
                          country: 'United States',
                          state: 'IL',
                          type: 'MAILING',
                          zip: '61201-8351',
                        },
                      ],
                      children: [
                        {
                          accountName: 'DOHRN WAREHOUSE - level 4',
                          accountType: 'Retailer',
                          address: [
                            {
                              addressLine1: '625 3RD AVENUE',
                              city: 'ROCK ISLAND',
                              country: 'United States',
                              state: 'IL',
                              type: 'MAILING',
                              zip: '61201-8351',
                            },
                          ],
                          level: 4,
                          sapAccountId: 3399158,
                          sapGlopid: 'd4de756d-1773-4013-8d0e-ead1def81228',
                        },
                      ],
                      level: 3,
                      sapAccountId: 3399157,
                      sapGlopid: 'd4de756d-1773-4013-8d0e-ead1def81220',
                    },
                  ],
                  level: 2,
                  sapAccountId: 1697849,
                  sapGlopid: 'd2538430-5dc0-46e4-833b-c06f14128ff2',
                },
                {
                  accountName: 'GROWMARK INC NASHVILLE WHS',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '17657-B Mockingbird Road',
                      city: 'NASHVILLE',
                      country: 'United States',
                      state: 'IL',
                      type: 'MAILING',
                      zip: '62263-3422',
                    },
                  ],
                  level: 2,
                  sapAccountId: 3444447,
                  sapGlopid: 'a16fb78c-e7a6-4621-8921-235639845b90',
                },
                {
                  accountName: 'SEEDWAY INC HQ HALL',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '1734 RAILROAD PL',
                      city: 'HALL',
                      country: 'United States',
                      state: 'NY',
                      type: 'MAILING',
                      zip: '14463',
                    },
                  ],
                  children: [
                    {
                      accountName: 'SEEDWAY INC MIFFLINBURG',
                      accountType: 'Retailer',
                      address: [
                        {
                          addressLine1: '275 N EIGHTH ST',
                          city: 'MIFFLINBURG',
                          country: 'United States',
                          state: 'PA',
                          type: 'MAILING',
                          zip: '17844-8504',
                        },
                      ],
                      level: 3,
                      sapAccountId: 1775005,
                      sapGlopid: '6021fb0a-5e6d-4d14-a18e-7226e0867dca',
                    },
                  ],
                  level: 2,
                  sapAccountId: 1774979,
                  sapGlopid: '82a855d1-d2c4-4c9d-b30a-9c0c0eb42b9e',
                },
                {
                  accountName: 'GROWMARK INC CYGNET',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '12965 DEFIANCE PIKE',
                      city: 'CYGNET',
                      country: 'United States',
                      state: 'OH',
                      type: 'MAILING',
                      zip: '43413',
                    },
                  ],
                  level: 2,
                  sapAccountId: 3281927,
                  sapGlopid: '9c6ae706-6021-4972-b6fd-938d039aaf93',
                },
                {
                  accountName: 'GROWMARK INC CASEY',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '700 W MONROE AVE',
                      city: 'CASEY',
                      country: 'United States',
                      state: 'IL',
                      type: 'MAILING',
                      zip: '62420',
                    },
                  ],
                  level: 2,
                  sapAccountId: 3386094,
                  sapGlopid: '7b354b60-5507-4407-8d76-cc178a3e8cfe',
                },
                {
                  accountName: 'GROWMARK INC FS RNTL WHS ALPHA',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '1695 US HWY 150',
                      city: 'ALPHA',
                      country: 'United States',
                      state: 'IL',
                      type: 'MAILING',
                      zip: '61413-9215',
                    },
                  ],
                  level: 2,
                  sapAccountId: 1828868,
                  sapGlopid: '97da621e-6664-4a4f-8145-f965bedd9eb3',
                },
              ],
              level: 1,
              sapAccountId: 1013083,
              sapGlopid: 'cf2b5a0d-0040-44c6-8e3c-4ac3d765686d',
            },
          },
        ],
      },
    };
    getLocations.mockReturnValue(locationResponse);
    const actual = await getLocationHierarchy('1013083', ['CP', 'SEED']);
    expect(actual).toEqual(expected);
  });

  it('getUsersLocationHierarchy when user is admin for multiple locations', async () => {
    const userLocationResponse = {
      records: [
        {
          keys: [
            'userId',
            'userName',
            'sapAccountId',
            'lob',
          ],
          _fields: [
            'john1',
            'john',
            'B',
            'Seed',
          ],
        },
        {
          keys: [
            'userId',
            'userName',
            'sapAccountId',
            'lob',
          ],
          _fields: [
            'john1',
            'john',
            'C',
            'Seed',
          ],
        },
      ],
    };
    const locationBResponse = {
      data: {
        accounts: [
          {
            key: 'SEED',
            value: {
              accountName: 'B Location',
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
                  accountName: 'D Location',
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
                  level: 3,
                  sapAccountId: 'D',
                  sapGlopid: '61997bcc-a7f9-42ae-8ad8-9d33b51e733b',
                },
              ],
              level: 2,
              sapAccountId: 'B',
              sapGlopid: 'cf2b5a0d-0040-44c6-8e3c-4ac3d765686d',
            },
          },
        ],
      },
    };
    const locationCResponse = {
      data: {
        accounts: [
          {
            key: 'SEED',
            value: {
              accountName: 'C Location',
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
                  accountName: 'G Location',
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
                  level: 3,
                  sapAccountId: 'G',
                  sapGlopid: '61997bcc-a7f9-42ae-8ad8-9d33b51e733b',
                },
              ],
              level: 2,
              sapAccountId: 'C',
              sapGlopid: 'cf2b5a0d-0040-44c6-8e3c-4ac3d765686d',
            },
          },
        ],
      },
    };

    const expected = [
      {
        children: [
          {
            id: '000000000D',
            level: 'Division',
            name: 'D Location',
            lob: ['seed'],
            children: [],
          },
        ],
        id: '000000000B',
        level: 'Region',
        name: 'B Location',
        lob: ['seed'],
      },
      {
        children: [
          {
            id: '000000000G',
            level: 'Division',
            name: 'G Location',
            lob: ['seed'],
            children: [],
          },
        ],
        id: '000000000C',
        level: 'Region',
        name: 'C Location',
        lob: ['seed'],
      },
    ];
    readTransaction.mockReturnValue(userLocationResponse);
    when(getLocations).calledWith('B').mockReturnValue(locationBResponse);
    when(getLocations).calledWith('C').mockReturnValue(locationCResponse);
    const actual = await getUsersLocationHierarchy('john1');
    expect(actual).toEqual(expected);
  });

  it('getUsersLocationHierarchy get locations based on user profile, user has no locations', async () => {
    const userLocationResponse = {
      records: [
      ],
    };
    const locationResponse = {
      data: {
        accounts: [
          {
            key: 'CP',
            value: {
              accountName: 'GROWMARK INC HQ BLOOMINGTON',
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
                  accountName: 'GROWMARK INC JCBSN WHS PLNFLD',
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
                  level: 2,
                  sapAccountId: 1746701,
                  sapGlopid: '61997bcc-a7f9-42ae-8ad8-9d33b51e733b',
                },
                {
                  accountName: 'GROWMARK INC ALPHA WHS',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '1695 US HIGHWAY 150',
                      city: 'ALPHA',
                      country: 'United States',
                      state: 'IL',
                      type: 'MAILING',
                      zip: '61413-9215',
                    },
                  ],
                  children: [
                    {
                      accountName: 'DOHRN WAREHOUSE',
                      accountType: 'Retailer',
                      address: [
                        {
                          addressLine1: '625 3RD AVENUE',
                          city: 'ROCK ISLAND',
                          country: 'United States',
                          state: 'IL',
                          type: 'MAILING',
                          zip: '61201-8351',
                        },
                      ],
                      children: [
                        {
                          accountName: 'DOHRN WAREHOUSE - level 4',
                          accountType: 'Retailer',
                          address: [
                            {
                              addressLine1: '625 3RD AVENUE',
                              city: 'ROCK ISLAND',
                              country: 'United States',
                              state: 'IL',
                              type: 'MAILING',
                              zip: '61201-8351',
                            },
                          ],
                          level: 4,
                          sapAccountId: 3399158,
                          sapGlopid: 'd4de756d-1773-4013-8d0e-ead1def81228',
                        },
                      ],
                      level: 3,
                      sapAccountId: 3399157,
                      sapGlopid: 'd4de756d-1773-4013-8d0e-ead1def81220',
                    },
                  ],
                  level: 2,
                  sapAccountId: 1697849,
                  sapGlopid: 'd2538430-5dc0-46e4-833b-c06f14128ff2',
                },
                {
                  accountName: 'GROWMARK INC NASHVILLE WHS',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '17657-B Mockingbird Road',
                      city: 'NASHVILLE',
                      country: 'United States',
                      state: 'IL',
                      type: 'MAILING',
                      zip: '62263-3422',
                    },
                  ],
                  level: 2,
                  sapAccountId: 3444447,
                  sapGlopid: 'a16fb78c-e7a6-4621-8921-235639845b90',
                },
                {
                  accountName: 'SEEDWAY INC HQ HALL',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '1734 RAILROAD PL',
                      city: 'HALL',
                      country: 'United States',
                      state: 'NY',
                      type: 'MAILING',
                      zip: '14463',
                    },
                  ],
                  children: [
                    {
                      accountName: 'SEEDWAY INC MIFFLINBURG',
                      accountType: 'Retailer',
                      address: [
                        {
                          addressLine1: '275 N EIGHTH ST',
                          city: 'MIFFLINBURG',
                          country: 'United States',
                          state: 'PA',
                          type: 'MAILING',
                          zip: '17844-8504',
                        },
                      ],
                      level: 3,
                      sapAccountId: 1775005,
                      sapGlopid: '6021fb0a-5e6d-4d14-a18e-7226e0867dca',
                    },
                  ],
                  level: 2,
                  sapAccountId: 1774979,
                  sapGlopid: '82a855d1-d2c4-4c9d-b30a-9c0c0eb42b9e',
                },
                {
                  accountName: 'GROWMARK INC CYGNET',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '12965 DEFIANCE PIKE',
                      city: 'CYGNET',
                      country: 'United States',
                      state: 'OH',
                      type: 'MAILING',
                      zip: '43413',
                    },
                  ],
                  level: 2,
                  sapAccountId: 3281927,
                  sapGlopid: '9c6ae706-6021-4972-b6fd-938d039aaf93',
                },
                {
                  accountName: 'GROWMARK INC CASEY',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '700 W MONROE AVE',
                      city: 'CASEY',
                      country: 'United States',
                      state: 'IL',
                      type: 'MAILING',
                      zip: '62420',
                    },
                  ],
                  level: 2,
                  sapAccountId: 3386094,
                  sapGlopid: '7b354b60-5507-4407-8d76-cc178a3e8cfe',
                },
                {
                  accountName: 'GROWMARK INC FS RNTL WHS ALPHA',
                  accountType: 'Retailer',
                  address: [
                    {
                      addressLine1: '1695 US HWY 150',
                      city: 'ALPHA',
                      country: 'United States',
                      state: 'IL',
                      type: 'MAILING',
                      zip: '61413-9215',
                    },
                  ],
                  level: 2,
                  sapAccountId: 1828868,
                  sapGlopid: '97da621e-6664-4a4f-8145-f965bedd9eb3',
                },
              ],
              level: 1,
              sapAccountId: 1013083,
              sapGlopid: 'cf2b5a0d-0040-44c6-8e3c-4ac3d765686d',
            },
          },
        ],
      },
    };
    const expected = [];
    readTransaction.mockReturnValue(userLocationResponse);
    getLocations.mockReturnValue(locationResponse);
    const actual = await getUsersLocationHierarchy('john1');
    expect(actual).toEqual(expected);
  });

  it('getLocationInfo returns expected values', async () => {
    const info = {
      data: [
        {
          publishedGlobalPartyIdentifier: '06007fd9-4d03-45fa-84a4-07245badf528',
          globalPartyIdentifier: '00882b2c-8438-465e-ad73-d8056e271f0d',
          provenance: {
            sourceSystem: 'IRD',
            subjectArea: 'ACCOUNT',
            identifier: '23883',
          },
          name: 'CHS INC RUTHTON',
          country: 'US',
          identifiers: [
            {
              type: 'ird-number',
              value: '23883',
              deletionCode: 'A',
              ranking: 't',
              isDeleted: false,
            },
            {
              type: 'sap-customer-number',
              value: '0001709615',
              deletionCode: 'A',
              ranking: 't',
              isDeleted: false,
            },
          ],
          extendedAttributes: [
            {
              name: 'shortName',
              value: 'CHS INC RUTHTON MN',
            },
          ],
          streetAddresses: [
            {
              usageType: 'shipping',
              city: 'RUTHTON',
              state: 'MN',
              postalCode: '561701048',
              addressLine1: '1780 221ST STREET',
            },
          ],
        },
      ],
    };
    const cu360HierResponse = {
      data: {
        nodes: [
          {
            globalPartyIdentifier: '7f9a0e60-4600-441a-bea9-e6dd9ae42f4c',
            identifiers: [
              {
                type: 'sap-customer-number',
                value: '0001013083',
              },
              {
                type: 'ird-number',
                value: '5180',
              },
            ],
            levels: [
              1,
            ],
          },
          {
            globalPartyIdentifier: '649be91f-f929-4896-b107-7314d1dbc7c4',
            identifiers: [
              {
                type: 'ird-number',
                value: '50138104',
              },
              {
                type: 'sap-customer-number',
                value: '0001709615',
              },
            ],
            levels: [
              3,
            ],
          },
          {
            globalPartyIdentifier: '428f8d51-178c-47e2-bc23-a4be897902b0',
            identifiers: [
              {
                type: 'ird-number',
                value: '50129105',
              },
              {
                type: 'sap-customer-number',
                value: '0001774979',
              },
            ],
            levels: [
              4,
            ],
          },
          {
            globalPartyIdentifier: 'bfe98b41-fcff-4068-80f4-76ea9aa01a2e',
            identifiers: [
              {
                type: 'ird-number',
                value: '50129401',
              },
              {
                type: 'sap-customer-number',
                value: '0001775005',
              },
            ],
            levels: [
              5,
            ],
          },
          {
            globalPartyIdentifier: '093624e9-f4bc-4014-bfb3-e08ad25be505',
            identifiers: [
              {
                type: 'ird-number',
                value: '50985607',
              },
              {
                type: 'sap-customer-number',
                value: '0003475537',
              },
            ],
            levels: [
              2,
            ],
          },
        ],
        relationships: [
          {
            from: '428f8d51-178c-47e2-bc23-a4be897902b0',
            to: 'bfe98b41-fcff-4068-80f4-76ea9aa01a2e',
            fromLevel: 4,
            toLevel: 5,
            active: true,
          },
          {
            from: '649be91f-f929-4896-b107-7314d1dbc7c4',
            to: '428f8d51-178c-47e2-bc23-a4be897902b0',
            fromLevel: 3,
            toLevel: 4,
            active: true,
          },
          {
            from: '093624e9-f4bc-4014-bfb3-e08ad25be505',
            to: '649be91f-f929-4896-b107-7314d1dbc7c4',
            fromLevel: 2,
            toLevel: 3,
            active: true,
          },
          {
            from: '7f9a0e60-4600-441a-bea9-e6dd9ae42f4c',
            to: '093624e9-f4bc-4014-bfb3-e08ad25be505',
            fromLevel: 1,
            toLevel: 2,
            active: true,
          },
        ],
      },
    };

    const expected = { city: 'RUTHTON', hqSapId: '0001013083', locationName: 'CHS INC RUTHTON', state: 'MN', streetAddress: '1780 221ST STREET', zipCode: '561701048', sourceSystem: 'sap-customer-number', featureSets: { payer: false } }; //eslint-disable-line
    getLocationDetails.mockReturnValue(info);
    getLocationPayerStatus.mockReturnValue(false);
    getPortalParamsByPortal.mockReturnValue({
      isHierarchyValid: true,
      hierarchyMap: {
            'sap-customer-number': 'IRD',
            'pbc-customer-number': 'IRD',
    }});
    getCu360Hierarchy.mockReturnValue(cu360HierResponse);
    const result = await getLocationInfo('1709615', 'sap-customer-number');
    expect(getLocationDetails).toBeCalledWith('0001709615', 'sap-customer-number');
    expect(result).toEqual(expected);
  });

  it('getLocationInfo returns expected values - Test Errors - Found parent node but could not get the corresponding sap customer number node', async () => {
    const info = {
      data: [
        {
          publishedGlobalPartyIdentifier: '06007fd9-4d03-45fa-84a4-07245badf528',
          globalPartyIdentifier: '00882b2c-8438-465e-ad73-d8056e271f0d',
          provenance: {
            sourceSystem: 'IRD',
            subjectArea: 'ACCOUNT',
            identifier: '23883',
          },
          name: 'CHS INC RUTHTON',
          country: 'US',
          identifiers: [
            {
              type: 'ird-number',
              value: '23883',
              deletionCode: 'A',
              ranking: 't',
              isDeleted: false,
            },
            {
              type: 'sap-customer-number',
              value: '0001709615',
              deletionCode: 'A',
              ranking: 't',
              isDeleted: false,
            },
          ],
          extendedAttributes: [
            {
              name: 'shortName',
              value: 'CHS INC RUTHTON MN',
            },
          ],
          streetAddresses: [
            {
              usageType: 'shipping',
              city: 'RUTHTON',
              state: 'MN',
              postalCode: '561701048',
              addressLine1: '1780 221ST STREET',
            },
          ],
        },
      ],
    };
    const cu360HierResponse = {
      data: {
        nodes: [
          {
            globalPartyIdentifier: '7f9a0e60-4600-441a-bea9-e6dd9ae42f4c',
            identifiers: [
              {
                type: 'sap-customer-number-test',
                value: '0001013083',
              },
              {
                type: 'ird-number',
                value: '5180',
              },
            ],
            levels: [
              1,
            ],
          },
          {
            globalPartyIdentifier: '649be91f-f929-4896-b107-7314d1dbc7c4',
            identifiers: [
              {
                type: 'ird-number',
                value: '50138104',
              },
              {
                type: 'sap-customer-number',
                value: '0001709615',
              },
            ],
            levels: [
              3,
            ],
          },
          {
            globalPartyIdentifier: '428f8d51-178c-47e2-bc23-a4be897902b0',
            identifiers: [
              {
                type: 'ird-number',
                value: '50129105',
              },
              {
                type: 'sap-customer-number',
                value: '0001774979',
              },
            ],
            levels: [
              4,
            ],
          },
          {
            globalPartyIdentifier: 'bfe98b41-fcff-4068-80f4-76ea9aa01a2e',
            identifiers: [
              {
                type: 'ird-number',
                value: '50129401',
              },
              {
                type: 'sap-customer-number',
                value: '0001775005',
              },
            ],
            levels: [
              5,
            ],
          },
          {
            globalPartyIdentifier: '093624e9-f4bc-4014-bfb3-e08ad25be505',
            identifiers: [
              {
                type: 'ird-number',
                value: '50985607',
              },
              {
                type: 'sap-customer-number',
                value: '0003475537',
              },
            ],
            levels: [
              2,
            ],
          },
        ],
        relationships: [
          {
            from: '428f8d51-178c-47e2-bc23-a4be897902b0',
            to: 'bfe98b41-fcff-4068-80f4-76ea9aa01a2e',
            fromLevel: 4,
            toLevel: 5,
            active: true,
          },
          {
            from: '649be91f-f929-4896-b107-7314d1dbc7c4',
            to: '428f8d51-178c-47e2-bc23-a4be897902b0',
            fromLevel: 3,
            toLevel: 4,
            active: true,
          },
          {
            from: '093624e9-f4bc-4014-bfb3-e08ad25be505',
            to: '649be91f-f929-4896-b107-7314d1dbc7c4',
            fromLevel: 2,
            toLevel: 3,
            active: true,
          },
          {
            from: '7f9a0e60-4600-441a-bea9-e6dd9ae42f4c',
            to: '093624e9-f4bc-4014-bfb3-e08ad25be505',
            fromLevel: 1,
            toLevel: 2,
            active: true,
          },
        ],
      },
    };

    try {
      const expected = { city: 'RUTHTON', hqSapId: '0001013083', locationName: 'CHS INC RUTHTON', state: 'MN', streetAddress: '1780 221ST STREET', zipCode: '561701048' }; //eslint-disable-line
      getLocationDetails.mockReturnValue(info, 'sap-customer-number');
      getCu360Hierarchy.mockReturnValue(cu360HierResponse);
      await getLocationInfo('1709615', 'sap-customer-number');
    }
    catch (error) {
      console.log(error.message);
      expect(error.message).toEqual('Error Code: CU105 - Found parent node but could not get the corresponding sap customer number node');
    }
  });

  it('getLocationInfo use POBox if physical address not found', async () => {
    const info = {
      data: [
        {
          publishedGlobalPartyIdentifier: '06007fd9-4d03-45fa-84a4-07245badf528',
          globalPartyIdentifier: '00882b2c-8438-465e-ad73-d8056e271f0d',
          provenance: {
            sourceSystem: 'IRD',
            subjectArea: 'ACCOUNT',
            identifier: '23883',
          },
          name: 'CHS INC RUTHTON',
          country: 'US',
          identifiers: [
            {
              type: 'ird-number',
              value: '23883',
              deletionCode: 'A',
              ranking: 't',
              isDeleted: false,
            },
            {
              type: 'sap-customer-number',
              value: '0001709615',
              deletionCode: 'A',
              ranking: 't',
              isDeleted: false,
            },
          ],
          extendedAttributes: [
            {
              name: 'shortName',
              value: 'CHS INC RUTHTON MN',
            },
          ],
          streetAddresses: [
          ],
          postOfficeBoxes: [
            {
              usageType: 'mailing',
              city: 'RUTHTON',
              state: 'MN',
              postalCode: '561701048',
              addressLine1: 'PO BOX 162',
            },
          ],
        },
      ],
    };
    const cu360HierResponse = {
      data: {
        nodes: [
          {
            globalPartyIdentifier: '7f9a0e60-4600-441a-bea9-e6dd9ae42f4c',
            identifiers: [
              {
                type: 'sap-customer-number',
                value: '0001013083',
              },
              {
                type: 'ird-number',
                value: '5180',
              },
            ],
            levels: [
              1,
            ],
          },
          {
            globalPartyIdentifier: '649be91f-f929-4896-b107-7314d1dbc7c4',
            identifiers: [
              {
                type: 'ird-number',
                value: '50138104',
              },
              {
                type: 'sap-customer-number',
                value: '0001709615',
              },
            ],
            levels: [
              3,
            ],
          },
          {
            globalPartyIdentifier: '428f8d51-178c-47e2-bc23-a4be897902b0',
            identifiers: [
              {
                type: 'ird-number',
                value: '50129105',
              },
              {
                type: 'sap-customer-number',
                value: '0001774979',
              },
            ],
            levels: [
              4,
            ],
          },
          {
            globalPartyIdentifier: 'bfe98b41-fcff-4068-80f4-76ea9aa01a2e',
            identifiers: [
              {
                type: 'ird-number',
                value: '50129401',
              },
              {
                type: 'sap-customer-number',
                value: '0001775005',
              },
            ],
            levels: [
              5,
            ],
          },
          {
            globalPartyIdentifier: '093624e9-f4bc-4014-bfb3-e08ad25be505',
            identifiers: [
              {
                type: 'ird-number',
                value: '50985607',
              },
              {
                type: 'sap-customer-number',
                value: '0003475537',
              },
            ],
            levels: [
              2,
            ],
          },
        ],
        relationships: [
          {
            from: '428f8d51-178c-47e2-bc23-a4be897902b0',
            to: 'bfe98b41-fcff-4068-80f4-76ea9aa01a2e',
            fromLevel: 4,
            toLevel: 5,
            active: true,
          },
          {
            from: '649be91f-f929-4896-b107-7314d1dbc7c4',
            to: '428f8d51-178c-47e2-bc23-a4be897902b0',
            fromLevel: 3,
            toLevel: 4,
            active: true,
          },
          {
            from: '093624e9-f4bc-4014-bfb3-e08ad25be505',
            to: '649be91f-f929-4896-b107-7314d1dbc7c4',
            fromLevel: 2,
            toLevel: 3,
            active: true,
          },
          {
            from: '7f9a0e60-4600-441a-bea9-e6dd9ae42f4c',
            to: '093624e9-f4bc-4014-bfb3-e08ad25be505',
            fromLevel: 1,
            toLevel: 2,
            active: true,
          },
        ],
      },
    };

    const expected = { city: 'RUTHTON', hqSapId: '0001013083', locationName: 'CHS INC RUTHTON', state: 'MN', streetAddress: 'PO BOX 162', zipCode: '561701048', 'sourceSystem': "sap-customer-number", featureSets: { payer: false } }; //eslint-disable-line
    getLocationDetails.mockReturnValue(info, 'sap-customer-number');
    getCu360Hierarchy.mockReturnValue(cu360HierResponse);
    const result = await getLocationInfo('1709615', 'sap-customer-number');
    expect(getLocationDetails).toBeCalledWith('0001709615', 'sap-customer-number');
    expect(result).toEqual(expected);
  });

  it('flatten locations', async () => {
    const lobhierarchy = [
      {
        id: '1013083',
        name: 'GROWMARK INC HQ BLOOMINGTON',
        level: 'HQ',
        lob: [
          'SEED',
        ],
        children: [
          {
            id: '1746701',
            name: 'GROWMARK INC JCBSN WHS PLNFLD',
            level: 'Region',
            lob: [
              'SEED',
            ],
          },
          {
            id: '1697849',
            name: 'GROWMARK INC ALPHA WHS',
            level: 'Region',
            lob: [
              'SEED',
            ],
            children: [
              {
                id: '3399157',
                name: 'DOHRN WAREHOUSE',
                level: 'Division',
                lob: [
                  'SEED',
                ],
                children: [
                  {
                    id: '3399158',
                    name: 'DOHRN WAREHOUSE - level 4',
                    level: 'Location',
                    lob: [
                      'SEED',
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: '3444447',
            name: 'GROWMARK INC NASHVILLE WHS',
            level: 'Region',
            lob: [
              'SEED',
            ],
          },
          {
            id: '1774979',
            name: 'SEEDWAY INC HQ HALL',
            level: 'Region',
            lob: [
              'SEED',
            ],
            children: [
              {
                id: '1775005',
                name: 'SEEDWAY INC MIFFLINBURG',
                level: 'Division',
                lob: [
                  'SEED',
                ],
              },
            ],
          },
          {
            id: '3281927',
            name: 'GROWMARK INC CYGNET',
            level: 'Region',
            lob: [
              'SEED',
            ],
          },
          {
            id: '3386094',
            name: 'GROWMARK INC CASEY',
            level: 'Region',
            lob: [
              'SEED',
            ],
          },
          {
            id: '1828868',
            name: 'GROWMARK INCFS RNTL WHS ALPHA',
            level: 'Region',
            lob: [
              'SEED',
            ],
          },
        ],
      },
    ];
    const expected = [
      {
        id: '1013083',
        name: 'GROWMARK INC HQ BLOOMINGTON',
        level: 'HQ',
        lob: [
          'SEED',
        ],
        children: null,
        parentID: '0',
      },
      {
        id: '1746701',
        name: 'GROWMARK INC JCBSN WHS PLNFLD',
        level: 'Region',
        lob: [
          'SEED',
        ],
        parentID: '1013083',
      },
      {
        id: '1697849',
        name: 'GROWMARK INC ALPHA WHS',
        level: 'Region',
        lob: [
          'SEED',
        ],
        children: null,
        parentID: '1013083',
      },
      {
        id: '3444447',
        name: 'GROWMARK INC NASHVILLE WHS',
        level: 'Region',
        lob: [
          'SEED',
        ],
        parentID: '1013083',
      },
      {
        id: '1774979',
        name: 'SEEDWAY INC HQ HALL',
        level: 'Region',
        lob: [
          'SEED',
        ],
        children: null,
        parentID: '1013083',
      },
      {
        id: '3281927',
        name: 'GROWMARK INC CYGNET',
        level: 'Region',
        lob: [
          'SEED',
        ],
        parentID: '1013083',
      },
      {
        id: '3386094',
        name: 'GROWMARK INC CASEY',
        level: 'Region',
        lob: [
          'SEED',
        ],
        parentID: '1013083',
      },
      {
        id: '1828868',
        name: 'GROWMARK INCFS RNTL WHS ALPHA',
        level: 'Region',
        lob: [
          'SEED',
        ],
        parentID: '1013083',
      },
      {
        id: '3399157',
        name: 'DOHRN WAREHOUSE',
        level: 'Division',
        lob: [
          'SEED',
        ],
        children: null,
        parentID: '1697849',
      },
      {
        id: '1775005',
        name: 'SEEDWAY INC MIFFLINBURG',
        level: 'Division',
        lob: [
          'SEED',
        ],
        parentID: '1774979',
      },
      {
        id: '3399158',
        name: 'DOHRN WAREHOUSE - level 4',
        level: 'Location',
        lob: [
          'SEED',
        ],
        parentID: '3399157',
      },
    ];
    const result = flattenLocations(lobhierarchy);
    expect(result).toEqual(expected);
  });
});
