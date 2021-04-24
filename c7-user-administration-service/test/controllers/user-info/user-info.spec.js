import { getUserInfo } from '../../../src/server/v1/rest/users/controllers';
import { readTransaction } from '../../../src/server/v1/neo4j.utils';
import MOCK_USER_RESULTS from './mock-user-results.test.json';
import EXPECTED_USER_RESULTS from './expected-user-results.test.json';
import { ErrorTypes, TypedError } from '../../../src/server/errors';

jest.mock('../../../src/server/v1/rest/users/users.queries', () => ({
  getUserInfoQuery: jest.fn(),
}));

jest.mock('../../../src/server/v1/neo4j.utils.js');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

let res;

describe('User Info Controller', () => {
  beforeEach(async () => {
    readTransaction.mockReturnValue(Promise.resolve(MOCK_USER_RESULTS));
    res = mockResponse();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should return user with location/role mapping', async () => {
    const federationId = '1234';
    const result = await getUserInfo(federationId);
    expect(JSON.stringify(result)).toBe(JSON.stringify(EXPECTED_USER_RESULTS));
  });

});
