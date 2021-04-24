import getUsersService from '@/server/v1/rest/users/services/getUsersService';

import * as api from '@/server/v1/rest/users/users.api.persistence';
import { User } from '@/server/v1/rest/users/types';
import * as queries from '@/server/v1/rest/users/queries';
import * as neo4jUtils from '@/server/v1/neo4j.utils';
import * as mappers from '@/server/v1/rest/users/mappers';

jest.mock('@/server/v1/rest/users/queries', () => ({
  getUsersQuery: jest.fn(),
}));

jest.mock('@/server/v1/rest/users/users.api.persistence', () => ({
  pendingUsers: jest.fn(() => Promise.resolve([])),
}));

jest.mock('@/server/v1/neo4j.utils', () => ({
  readTransaction: jest.fn(),
}));

jest.mock('@/server/v1/rest/users/mappers', () => ({
  mapNeo4jStatementResultToLoginDetails: jest.fn(),
}));

describe('get Users', () => {
  getUsersService({}, '123');

  it('calls pendingUsers', () => {
    expect(api.pendingUsers).toHaveBeenCalled();
  })

  it('calls getUsersQuery', () => {
    expect(queries.getUsersQuery).toHaveBeenCalled();
  });

  it('calls readTransaction', () => {
    expect(neo4jUtils.readTransaction).toHaveBeenCalled();
  });

  it('calls mapNeo4jStatementResultToLoginDetails', () => {
    expect(mappers.mapNeo4jStatementResultToLoginDetails).toHaveBeenCalled();
  });
});

describe('get Users by SapId with conditionals', () => {
  const conditionals: Partial<User> = {
    first_name: 'J',
    last_name: 'W',
    city: 'C',
    state: 'S',
  };

  getUsersService(conditionals, '123');

  it('calls getUsersQuery', () => {
    expect(queries.getUsersQuery).toHaveBeenCalled();
  });

  it('calls readTransaction', () => {
    expect(neo4jUtils.readTransaction).toHaveBeenCalled();
  });

  it('calls mapNeo4jStatementResultToLoginDetails', () => {
    expect(mappers.mapNeo4jStatementResultToLoginDetails).toHaveBeenCalled();
  });
});
