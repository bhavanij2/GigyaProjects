
import { readTransaction } from '@/server/v1/neo4j.utils';

import { to } from 'await-to-js'
import { getUserInfoService } from '@/server/v1/rest/users/users.persistence'

jest.mock('../../../src/server/v1/neo4j.utils.js');

describe('User Info Persistence', () => {

  it('should return error if results are not returned', async () => {
    const query = 'query';
    readTransaction.mockReturnValue(Promise.reject('error'))
    const [error, result] = await to(getUserInfoService('mock id'));

    expect(error.message).toBe('Failed to retrieve user information');
  });
});
