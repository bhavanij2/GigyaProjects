import axios from 'axios';
import oauth from '@monsantoit/oauth-ping';
import { readTransaction } from '../../src/server/v1/neo4j.utils';
import USER_SEARCH_RESULTS from './user-search-results.test.json';
import USER_SEARCH_API_RESULTS from './user-search-api-results.test.json';
import USER_QUERY_RESULTS from './user-query-results.test.json';
import {
  requestUserAccountsFromLocation,
  searchLocationsFromQuery,
} from '../../src/server/v1/controllers/search';

import { internalUserIsAuthorized } from '../../src/server/v1/middleware/internal-authorization';
import { getRolesFromEntitlement } from '../../src/server/v1/middleware/internal-authorization/velocity-mappings';

const USER_HIERARCHY = {
  data: {
    accounts: [
      {
        value: {
          accountName: 'GigaBit Inc.',
          sapAccountId: 1024000,
        },
      },
      {
        value: {
          accountName: 'GigaBit Inc.',
          sapAccountId: 1024000,
          children: [
            {
              accountName: 'Test Company 3',
              sapAccountId: 2048000,
            },
          ],
        },
      },
    ],
  },
};

const ExpressMock = function ExpressMock() {
  const mock = {
    req: {
      app: {
        locals: {
          docClient: null,
        },
      },
      headers: {
        admintype: null,
      },
      params: {
        sapId: null,
      },
      query: {
        'account-name': null,
      },
    },
    res: {
      status: () => mock.res,
      send: jest.fn(),
    },
    next: () => {},
  };

  return mock;
};

/**
 * STUB PROXY
 */

const servicesProxy = {
  get: () => '',
};

const sp = new Proxy({}, servicesProxy);


/**
 * MOCK Modules
 */

jest.mock('@monsantoit/oauth-ping');
jest.mock('axios');
jest.mock('../../src/server/v1/neo4j.utils.js');
jest.mock('../../src/server/v1/middleware/internal-authorization/velocity-mappings.js');
jest.mock('../../src/server/v1/rest/users/users.service');

/**
 * Temp Vars
 */

let express;


describe('Search Controller', () => {
  beforeEach(async () => {
    oauth.httpGetToken.mockReturnValue(() => new Promise(resolve => resolve(true)));
    express = ExpressMock();
    readTransaction.mockReturnValue(Promise.resolve(USER_SEARCH_RESULTS));
    axios.get.mockReturnValue(Promise.resolve(USER_HIERARCHY));
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('#requestUserAccountsFromLocation()', () => {
    it('should return a list of users belonging to a SAPID', async () => {
      const { req, res } = express;
      await requestUserAccountsFromLocation(req, res);

      const result = res.send.mock.calls[0][0];

      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('id');
    });
  });
  describe('#searchLocationsFromQuery()', () => {
    it('should return default list of locations if no query is specified', async () => {
      const { req, res } = express;
      req.params.sapId = '0001024000';
      req.query['account-name'] = '';
      await searchLocationsFromQuery(req, res);

      const results = res.send.mock.calls[0][0];
      console.log('Search Results');
      console.log(results);

      expect(results.length).toBe(2);
    });
    it('should return all location matches from query', async () => {
      const { req, res } = express;
      req.params.sapId = '0001024000';
      req.query['account-name'] = 'GIGABIT INC';

      await searchLocationsFromQuery(req, res);

      const results = res.send.mock.calls[0][0];

      expect(results.length).toBe(1);
      expect(results[0].accountName).toBe('GigaBit Inc.');
    });
    it('should return an empty array if no match is found', async () => {
      const { req, res } = express;
      req.params.sapId = '0000000000';
      req.query['account-name'] = 'Does not exist';

      await searchLocationsFromQuery(req, res);

      const results = res.send.mock.calls[0][0];

      expect(results.length).toBe(0);
    });
  });
});
