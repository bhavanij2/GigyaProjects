import {
  zipObject,
  chain,
  pick,
  reduce,
} from 'lodash';
import {
  writeTransaction,
  readTransaction,
} from '../neo4j.utils';
import {
  getUsersWithRolesByLocationQuery,
  deleteUserQuery,
  updateUserDataByFedIdQuery,
  getLocationQuery,
  createLocationQuery,
} from '../queries.util';
import { getLocationInfo } from '../locations';
import {
  sqs,
  sendSqsMessage,
} from '../../sqs.utils';
import { getUserEntitlementsUserProfileQuery } from '../rest/users/users.queries';
import Record from 'neo4j-driver/lib/v1/record';
import { to } from 'await-to-js';

const groupByUserSapAccountRole = dbResult => chain(dbResult.records)
  .map(record => zipObject(record.keys, record._fields))
  .map(record => ({
    ...record,
    _key: `${record.userId}-${record.sapAccountId}-${record.roleName}`,
  }))
  .groupBy('_key')
  .value();

const getLobForGroupedRoles = (groupedRoles, key) => chain(groupedRoles[key])
  .map(row => ({
    lob: row.lob,
    roleId: row.roleId,
  }))
  .value();

const addLobToRole = groupedResult => {
  const keys = Object.keys(groupedResult);
  return keys.map(key => {
    const lobArray = getLobForGroupedRoles(groupedResult, key);
    const newObj = pick(groupedResult[key][0], ['userId', 'userName', 'sapAccountId', 'sapAccountName', 'roleName']);
    return {
      ...newObj,
      lobIdArray: lobArray,
    };
  });
};

const getPermissionsByAccount = (groupedBySapAccountId, key) => {
  const accountPermissions = reduce(
    groupedBySapAccountId[key],
    (memo, val) => [
      ...memo,
      `${val.pid}:${val.permissionType}`,
    ],
    [],
  );
  return {
    sapAccountNumber: key,
    permissions: accountPermissions,
  };
};

const getLocationPermissionsArray = accountsPermissionsArray => reduce(accountsPermissionsArray,
  (memo, val) => ({
    ...memo,
    [val.sapAccountNumber]: val.permissions,
  }),
  {});

export const getUsersWithRolesByLocation = async sapAccountId => {
  const query = getUsersWithRolesByLocationQuery(sapAccountId);
  const result = await readTransaction(query);
  const groupedResult = groupByUserSapAccountRole(result);
  return addLobToRole(groupedResult);
};


const getEntitlements = async query => {
  const result = await readTransaction(query, { required: true });
  const arrayGroupedBySapAccountId = chain(result.records)
    .map(record => zipObject(record.keys, record._fields))
    .groupBy('sapAccountId')
    .value();
  const keys = Object.keys(arrayGroupedBySapAccountId);
  const accountsPermissionsArray = keys.map(key => getPermissionsByAccount(arrayGroupedBySapAccountId, key));
  return getLocationPermissionsArray(accountsPermissionsArray);
};

// Queries on brand, username, persona
export const getUserEntitlementsUserProfile = async (userId, brand, persona) => {
  const query = getUserEntitlementsUserProfileQuery(userId, brand, persona);
  return getEntitlements(query);
};

export const deleteUsers = async federationId => {
  const result = await writeTransaction(deleteUserQuery, federationId);
  return result;
};

export const getLocation = async (sapAccountId, sourceSystem, country = 'US', portal = 'mycrop') => {
  const query = getLocationQuery(sapAccountId, sourceSystem);
  const result = await readTransaction(query);
  const locations = result.records.map(record => {
    const neoRecord = new Record(record.keys, record._fields, record._fieldLookup);
    return neoRecord.get('Location');
  });
  if (locations.length > 0) {
    const { name, ...properties } = locations[0].properties;
    return {
      ...properties,
      locationName: name,
    }
  }
  const locationInfo = await getLocationInfo(sapAccountId, sourceSystem, country, portal);
  const [writeError] = await to(writeTransaction(createLocationQuery, {...locationInfo, sapAccountId}));
  if (writeError) {
    console.error(writeError);
  }
  return locationInfo;
};

// in progress
export const updateUserDataListByFedId = async body => {
  const errors = [];

  await Promise.all(body.map(async item => {
    writeTransaction(updateUserDataByFedIdQuery, item).catch(error => {
      errors.push(error);
    });
  }));

  if (errors.length) {
    return errors;
  }
  return 'SUCCESS';
};
