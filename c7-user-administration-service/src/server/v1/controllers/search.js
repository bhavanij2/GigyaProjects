/**
 * Search Controller
 * NOTES: Search must include location of user doing search to limit scope to only show users belonging to searcher's company's location
 * !!! Search for location under company tree !!!
 *
 * AC:
 * 1. Initial search takes the SAPID from the searcher
 * 2. The search query provided will be used to search the results from the first request containing the searcher's SAPID
 * 3. When a query match is found in the results, a second API call will be made with the sapAccountId returned from the match to get a list of users
 * 4. Return the list of users from the second request containing the sapAccountId
 */

import axios from 'axios';
import combineErrors from 'combine-errors';
import { chain, zipObject } from 'lodash';
import { to } from 'await-to-js';
import generateBearerToken from '../../utils/auth.utils';
import { getUsersFromLocation } from '../queries.util';
import { readTransaction } from '../neo4j.utils';

/**
 * @function _requestUserHierarchy
 * @async
 * @private
 * @param {String} sapId - User SAP ID
 * @description Fetches user Hierachry from HYBRIS API and returns a list of locations
 * @returns {Promise<Array>} Response from User Hierarchy Request
 */
async function _requestUserHierarchy(sapId) {
  const url = `${process.env.hybris_location_hierarchy_api}/${sapId}/accountHierarchy?excludeAddress=false`;
  const config = {
    headers: {
      Authorization: `Bearer ${await generateBearerToken()}`,
    },
  };

  const [err, response] = await to(axios.get(url, config));

  return err ? Promise.reject(combineErrors([new Error('Failed to request user hierarchy'), err])) : Promise.resolve(response.data.accounts);
}

/**
 * @function _searchLocationHierarchyFromQuery
 * @async
 * @private
 * @param {Array} hierarchy - Hierarchy returned from user hierarchy request
 * @param {String} query - Search query to match location
 * @returns {Promise<Array>} Array containing locations based on query match
 * @description Searches hierarchy by search query and returns an array of matching locations
 */
async function _searchLocationHierarchyFromQuery(hierarchy = [], query = '') {
  const locations = [];
  const match = o => new RegExp(query, 'gmi').test(o.accountName);
  const format = sapId => `000${sapId}`.toString();
  const traverse = collections => {
    collections.forEach(collection => {
      const col = collection.value || collection;
      if (col) {
        locations.push({
          accountName: col.accountName, sapAccountId: format(col.sapAccountId), id: format(col.sapAccountId), name: col.accountName,
        });
        if (col.children && col.children.length) {
          traverse(col.children);
        }
      }
    });
  };

  traverse(hierarchy);

  const uniqueLocations = chain(locations)
    .filter(match)
    .uniqBy('id')
    .value();

  return Promise.resolve(uniqueLocations);
}

/**
 * @function requestUserAccountsFromLocation
 * @async
 * @public
 * @param {Object} req - Express Request Object
 * @param {Object} res - Express Response Object
 * @description Requests a list of users belonging to the given sapAccountId
 */
export async function requestUserAccountsFromLocation(req, res) {
  const { sapAccountId } = req.params;
  const fail = msg => res.status(500).send({ err: msg || 'Failed to fetch users from location. Please try again later' });
  const query = getUsersFromLocation(sapAccountId);
  const [neo4jError, result] = await to(readTransaction(query));

  if (neo4jError) {
    console.error(neo4jError);
    return fail(process.env.NODE_ENV !== 'production' ? neo4jError.message : null);
  }

  return res.status(200).send(
    chain(result.records)
      .map(record => zipObject(record.keys, record._fields))
      .map(record => record.user.properties)
      .value(),
  );
}

/**
 * @function searchLocationsFromQuery
 * @async
 * @public
 * @param {Object} req - Express Request Object
 * @param {Object} res - Express Response Object
 * @description Searches for users based on searcher's locale / scope
 * TODO: Possible search throttling / rate-limiting
 */
export async function searchLocationsFromQuery(req, res) {
  const { sapId } = req.params;
  const query = req.query['account-name'];
  const fail = msg => res.status(500).send({ error: msg || 'Failed to complete search. Please try again later.' });
  const [requestError, accounts] = await to(_requestUserHierarchy(sapId));

  if (requestError) {
    console.error(requestError);
    return fail(process.env.NODE_ENV !== 'production' ? requestError.message : null);
  }

  return res.send(await _searchLocationHierarchyFromQuery(accounts, query));
}
