import { to } from 'await-to-js';
import { getUser } from '../../src/server/v1/queries.util';
import { readTransaction } from '../../src/server/v1/transaction/read';
import * as Test from '../../src/server/v1/persistence/user';

jest.mock('../../src/server/v1/queries.util.js', () => ({
  getUser: jest.fn(),
}));

jest.mock('../../src/server/v1/transaction/read.js', () => ({
  readTransaction: jest.fn(),
}));

const mockResult = {
  records: [
    {
      keys: [
        'user',
      ],
      length: 1,
      _fields: [
        {
          identity: {
            low: 9,
            high: 0,
          },
          labels: [
            'User',
          ],
          properties: {
            home_phone: '(314)555-1212',
            zipCode: '63111',
            persona: 'dealer',
            city: 'Saint Louis',
            last_name: 'Tester',
            primary_phone: '3145551212',
            hqSapId: '0001696557',
            secondary_phone: '',
            mobile_phone: '(314)555-3434',
            contact_glopid: '3c575dce-fdaa-44d3-ab64-e24a53bf0b02',
            address_line_1: '123 Bayer Parkway',
            name: 'Shanon_Fahey@gmail.com',
            address_line_2: '',
            state: 'MO',
            id: 'ram1@test.com',
            federationId: 'e9f341da23514d679a04e722eb17b502',
            brand: 'national',
            first_name: 'Niko',
          },
        },
      ],
      _fieldLookup: {
        user: 0,
      },
    },
  ],
};

const resultUser = mockResult.records[0]._fields[0].properties;

describe('Get User Persistence', () => {
  it('returns error when readTransaction fails', async () => {
    const query = 'query';
    const federationId = 'abcd';
    getUser.mockReturnValue(query);
    readTransaction.mockReturnValue(Promise.reject(new Error('Read Transaction Failed')));

    const [error] = await to(Test.getUser(federationId));

    expect(error.message).toBe('Failed to get user; Read Transaction Failed');
    expect(getUser).toBeCalledWith(federationId);
    expect(readTransaction).toBeCalledWith(query);
  });

  it('returns user object when read success', async () => {
    const query = 'query';
    const federationId = 'abcd';
    getUser.mockReturnValue(query);
    readTransaction.mockReturnValue(Promise.resolve(mockResult));

    const [error, result] = await to(Test.getUser(federationId));

    expect(error).toBeNull();
    expect(result).toMatchObject(resultUser);
    expect(getUser).toBeCalledWith(federationId);
    expect(readTransaction).toBeCalledWith(query);
  });

  it('returns undefined when user is not found', async () => {
    const query = 'query';
    const federationId = 'abcd';
    getUser.mockReturnValue(query);
    readTransaction.mockReturnValue(Promise.resolve({ records: [] }));

    const [error, result] = await to(Test.getUser(federationId));

    expect(error).toBeNull();
    expect(result).toBeUndefined(result);
    expect(getUser).toBeCalledWith(federationId);
    expect(readTransaction).toBeCalledWith(query);
  });
});
