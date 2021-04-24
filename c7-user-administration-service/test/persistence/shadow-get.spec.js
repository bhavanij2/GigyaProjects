import { to } from 'await-to-js';
import { getShadowedUser } from '../../src/server/v1/queries.util';
import { readTransaction } from '../../src/server/v1/transaction/read';
import * as Test from '../../src/server/v1/persistence/shadow';

jest.mock('../../src/server/v1/queries.util.js', () => ({
  getShadowedUser: jest.fn(),
}));

jest.mock('../../src/server/v1/transaction/read.js', () => ({
  readTransaction: jest.fn(),
}));

const mockData = {
  records: [
    {
      keys: [
        'u.federationId',
      ],
      length: 1,
      _fields: [
        'e9f341da23514d679a04e722eb17b502',
      ],
      _fieldLookup: {
        'u.federationId': 0,
      },
    },
  ],
};

describe('Shadow getFederationId Persistence', () => {
  it('rejects when readTransaction fails', async () => {
    const federationId = 'abcd';
    const query = 'query';
    getShadowedUser.mockReturnValue(query);
    readTransaction.mockReturnValue(Promise.reject(new Error('Read Transaction Failed')));

    const [error] = await to(Test.getFederationId(federationId));

    expect(error.message).toBe('Failed to read federationId');
    expect(getShadowedUser).toBeCalledWith(federationId);
    expect(readTransaction).toBeCalledWith(query);
  });

  it('resolves to the current users federationId, when found to not be shadowing', async () => {
    const federationId = 'abcd';
    const query = 'query';
    getShadowedUser.mockReturnValue(query);
    readTransaction.mockReturnValue(Promise.resolve({ records: [] }));

    const [error, result] = await to(Test.getFederationId(federationId));

    expect(error).toBeNull();
    expect(result).toMatchObject({
      federationId,
      shadow: false,
    });
    expect(getShadowedUser).toBeCalledWith(federationId);
    expect(readTransaction).toBeCalledWith(query);
  });

  it('resolves to the federationId of the person they are shadowing, when records found', async () => {
    const federationId = 'abcd';
    const query = 'query';
    getShadowedUser.mockReturnValue(query);
    readTransaction.mockReturnValue(Promise.resolve(mockData));

    const [error, result] = await to(Test.getFederationId(federationId));

    expect(error).toBeNull();
    expect(result).toMatchObject({
      federationId: 'e9f341da23514d679a04e722eb17b502',
      shadow: true,
    });
    expect(getShadowedUser).toBeCalledWith(federationId);
    expect(readTransaction).toBeCalledWith(query);
  });
});
