import moment from 'moment';
import { to } from 'await-to-js';
import {
  zipObject,
  chain,
} from 'lodash';
import {
  getUserInfoQuery,
} from './users.queries';
import {
  readTransaction,
} from '../../neo4j.utils';
import {
  TypedError,
  ErrorTypes,
} from '../../../errors';

const getUsersFrom = dbResult => chain(dbResult.records)
  .map(record => zipObject(record.keys, record._fields))
  .map(record => record.user.map(user => ({ lastLogin: moment(0), ...user.properties })))
  .value()[0];

const aggregateUserInfo = info => info.reduce((agg, entry) => {
  const { user, role, location } = entry;
  const sapId = location.properties.sapid;
  const roleId = role.properties.id;
  // set user profile section of response
  agg.profile = { lastLogin: moment(0), ...user.properties };

  // add new location if it's not already added
  if (!agg.locations[sapId]) {
    agg.locations[sapId] = { ...location.properties, roles: {} };
  }
  const aggLoc = agg.locations[sapId];

  // add new role to location if it's not already added
  if (!aggLoc.roles[roleId]) {
    aggLoc.roles[roleId] = role.properties;
  }
  return agg;
}, { profile: {}, locations: {} });

export const userInfoService = async federationId => {
  const query = getUserInfoQuery(federationId);
  const [error, result] = await to(readTransaction(query, { required: true }));
  if (error) {
    throw new TypedError(
      ErrorTypes.INTERNAL_SERVER_ERROR,
      'Error retrieving user info',
      [error.stack],
    );
  }

  const records = result.records.map(record => zipObject(record.keys, record._fields));
  const userInfo = aggregateUserInfo(records);
  return userInfo;
};
