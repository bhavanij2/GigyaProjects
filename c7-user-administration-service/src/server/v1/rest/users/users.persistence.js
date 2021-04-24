import moment from 'moment';
import uuid from 'uuid/v1';

import { to } from 'await-to-js';

import {
  zipObject,
  chain,
  pick,
  reduce,
} from 'lodash';

import updateUserGigyaStatus from '../../gigya.utils';

import {
  readTransaction,
  writeListTransaction,
  writeTransaction,
} from '../../neo4j.utils';
import { TypedError, ErrorTypes } from '../../../errors';
import {
  sendAuditMessage,
  sendSqsMessage,
  sqs,
  syncNewUserToCu360,
} from '../../../sqs.utils';

import {
  addUserRoleQuery,
  deleteUserRoleQuery,
  editUserRoleQuery,
  getUserRolesQuery,
  getUserApplicationEntitlementsQuery,
  getUserEntitlementsQuery,
  getUserEntitlementsUserProfileQuery,
  getUserInfoQuery,
  getHqSapIdQuery,
  getUserProfileQueryByFedId,
  getUserProfileQueryByUserId,
  getUserAccountsQuery,
  getUserAccountsQueryByUseridQuery,
  getUsersFromHqSearchQuery,
  updateUserDataQuery,
  createUserQuery,
  addUserRoleByIdQuery,
} from './users.queries';

import { removeSapAccountPadding } from '../../../util';

import ProfileResponse from '../../profile/ProfileResponse';
import { getLocation } from '../../entitlements';

import {
  createUserObj,
} from '../../entitlements/entitlements.util';

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

const getHqSapId = dbResult => chain(dbResult.records)
  .map(record => zipObject(record.keys, record._fields))
  .value()[0].hqSapId;

export const getUsersHqSapId = async federationId => {
  const hqSapIdQuery = getHqSapIdQuery(federationId);
  const hqSapIdResult = await readTransaction(hqSapIdQuery);
  return getHqSapId(hqSapIdResult);
};

export const getUserRolesService = async federationId => {
  const query = getUserRolesQuery(federationId);
  const result = await readTransaction(query);
  const groupedResult = groupByUserSapAccountRole(result);
  return addLobToRole(groupedResult);
};

const getApplicationPermissionsByAccount = (groupedBySapAccountId, key) => {
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

const getApplicationLocationPermissionsArray = accountsPermissionsArray => reduce(accountsPermissionsArray,
  (memo, val) => ({
    ...memo,
    [val.sapAccountNumber]: val.permissions,
  }),
  {});

const brandsMap = {
  national: 'NB',
  channel: 'CB',
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

const processAccounts = async query => {
  const result = await readTransaction(query, { required: true });
  const processed = chain(result.records)
    .map(record => zipObject(record.keys, record._fields))
    .uniqBy(record => record.sapAccountId)
    .value();
  const user = {
    userName: processed[0].userName,
    uid: processed[0].contactGlopid,
    glopid: processed[0].contactGlopid,
    userType: processed[0].persona.toUpperCase(),
    mimeType: 'image/jpeg',
    federationId: processed[0].uid,
    contactSfdcId: processed[0].contactSfdcId || '',
    firstName: processed[0].firstName || '',
    lastName: processed[0].lastName || '',
    primaryPhone: processed[0].primaryPhone || '',
    secondaryPhone: processed[0].secondaryPhone || '',
    secondaryPhoneType: processed[0].secondaryPhoneType || '',
    primaryPhoneType: processed[0].primaryPhoneType || '',
    addressLine1: processed[0].addressLine1 || '',
    addressLine2: processed[0].addressLine2 || '',
    city: processed[0].userCity || '',
    state: processed[0].userState || '',
    status: processed[0].status || '',
    zipCode: processed[0].zipCode || '',
  };
  const processedAccounts = chain(processed)
    .map(account => ({
      sapAccountId: account.sapAccountId,
      city: account.city,
      state: account.state,
      accountName: account.accountName,
      uid: account.sapAccountId,
      brands: [brandsMap[account.brand]],
    }))
    .value();
  return {
    ...user,
    accounts: processedAccounts,
  };
};

const getListOfUsersWithAllFields = dbResult => chain(dbResult.records)
  .map(record => zipObject(record.keys, record._fields))
  .map(record => ({
    id: record.user.properties.id,
    name: record.user.properties.name,
    federationId: record.user.properties.federationId,
    brand: record.user.properties.brand,
    persona: record.user.properties.persona,
    first_name: record.user.properties.first_name,
    last_name: record.user.properties.last_name,
    address_line_1: record.user.properties.address_line_1,
    address_line_2: record.user.properties.address_line_2,
    city: record.user.properties.city,
    state: record.user.properties.state,
    zipCode: record.user.properties.zipCode,
    hqSapId: record.user.properties.hqSapId,
    primary_phone: record.user.properties.primary_phone,
    primary_phone_type: record.user.properties.primary_phone_type,
    secondary_phone: record.user.properties.secondary_phone,
    secondary_phone_type: record.user.properties.secondary_phone_type,
    status: record.user.properties.status,
    testUser: record.user.properties.testUser,
  }))
  .value();

const handleResponseObject = async response => {
  const responseObject = response.records[0].toObject();
  if (Array.isArray(responseObject.sapAccountIds)) {
    responseObject.sapAccountIds = responseObject.sapAccountIds.map(sai => removeSapAccountPadding(sai));
  }

  return new ProfileResponse(200, responseObject, 'User profile was found.');
};

const getListOfUsers = dbResult => chain(dbResult.records)
  .map(record => zipObject(record.keys, record._fields))
  .map(record => ({
    id: record.user.properties.id,
    name: record.user.properties.name,
  }))
  .value();

const getUsersFrom = dbResult => chain(dbResult.records)
  .map(record => zipObject(record.keys, record._fields))
  .map(record => record.user.map(user => ({ lastLogin: moment(0), ...user.properties })))
  .value()[0];

// Solution for today: applications query on username, brand, and persona because Ocelot isn't appending permissions
// Solution for later: ocelot will query on federationId and append to header. Will Ocelot have GigyaId or userId/username?
//  userId is not unique without brand and persona
export const getUserApplicationEntitlements = async (federationId, application) => {
  const query = getUserApplicationEntitlementsQuery(federationId, application);
  const result = await readTransaction(query, { required: true });
  const arrayGroupedBySapAccountId = chain(result.records)
    .map(record => zipObject(record.keys, record._fields))
    .groupBy('sapAccountId')
    .value();

  const keys = Object.keys(arrayGroupedBySapAccountId);
  const accountsPermissionsArray = keys.map(key => getApplicationPermissionsByAccount(arrayGroupedBySapAccountId, key));
  return getApplicationLocationPermissionsArray(accountsPermissionsArray);
};

// Queries on federationId
export const getUserEntitlements = async federationId => {
  const query = getUserEntitlementsQuery(federationId);
  return getEntitlements(query);
};

// Queries on brand, username, persona
export const getUserEntitlementsUserProfileService = async (userId, brand, persona) => {
  const query = getUserEntitlementsUserProfileQuery(userId, brand, persona);
  return getEntitlements(query);
};

export const getProfileByFederationIdService = async federationId => {
  const query = getUserProfileQueryByFedId(federationId);
  const res = await readTransaction(query);
  if (!res.records.length) {
    return new ProfileResponse(404, null, `User profile with federationId ${federationId} could not be found.`);
  }

  return handleResponseObject(res);
};

export const getProfileByUserIdService = async (userID, brand, persona) => {
  const query = getUserProfileQueryByUserId(userID, brand, persona);
  const res = await readTransaction(query);
  if (!res.records.length) {
    return new ProfileResponse(404, null, `User profile with userId ${userID}, brand ${brand}, and persona ${persona} could not be found.`);
  }

  return handleResponseObject(res);
};

export const getAccountsByFedIdService = async federationId => {
  const query = getUserAccountsQuery(federationId);
  return processAccounts(query);
};

export const getAccountsByUserIdService = async (userId, brand, persona) => {
  const query = getUserAccountsQueryByUseridQuery(userId, brand, persona);
  return processAccounts(query);
};

const aggregateUserInfo = info => info.reduce((agg, entry) => {
  const { user, role, location } = entry;
  // set user profile section of response
  agg.profile = { lastLogin: moment(0), ...user.properties };
  if(location && role) {
    const sapId = location.properties.sapid;
    const roleId = role.properties.id;
  
    // add new location if it's not already added
    if (!agg.locations[sapId]) {
      agg.locations[sapId] = { ...location.properties, roles: {} };
    }
    const aggLoc = agg.locations[sapId];
  
    // add new role to location if it's not already added
    if (!aggLoc.roles[roleId]) {
      aggLoc.roles[roleId] = role.properties;
    }
  }
  return agg;
}, { profile: {}, locations: {} });

export const getUserInfoService = async fedId => {
  const query = getUserInfoQuery(fedId);
  const [error, result] = await to(readTransaction(query, { required: true }));
  if (error) {
    throw new TypedError(ErrorTypes.INTERNAL_SERVER_ERROR, 'Failed to retrieve user information', [error.stack]);
  }

  const records = result.records.map(record => zipObject(record.keys, record._fields));
  const userInfo = aggregateUserInfo(records);
  return userInfo;
};

export const addUserRoleService = async body => {
  const locationInfo = await getLocation(body.sapAccountId);
  const userRoleLocationInfo = { ...locationInfo, ...body };
  await writeListTransaction(addUserRoleQuery, userRoleLocationInfo, body.lobList);

  await sendSqsMessage(sqs(), 'audit-log-sqs', {
    updatedBy: body.adminId || 'SYSTEM',
    updatedTimestamp: moment().format(),
    transactionId: uuid(),
    application: 'User Admin',
    action: 'ADD USER ROLE',
    field: 'USER',
    from: {},
    to: {
      federationId: body.federationId,
      sapAccountNumber: body.sapAccountId,
      roleName: body.roleName,
      lobList: body.lobList,
    },
  });
  return { code: '201', message: 'The relationship was successfully created.' };
};

export const deleteUserRoleService = async body => {
  await writeListTransaction(deleteUserRoleQuery, body, body.lobList);
  await sendSqsMessage(sqs(), 'audit-log-sqs', {
    updatedBy: body.adminId || 'SYSTEM',
    updatedTimestamp: moment().format(),
    transactionId: uuid(),
    application: 'User Admin',
    action: 'DELETE USER ROLE',
    field: 'USER',
    from: {
      federationId: body.federationId,
      sapAccountNumber: body.sapAccountId,
      roleName: body.roleName,
      lobList: body.lobList,
    },
    to: {
    },
  });
  return { code: '200', message: 'The relationship was successfully deleted.' };
};

export const editUserRoleService = async (federationId, oldRole, newRole, adminId) => {
  const locationInfo = await getLocation(newRole.locationId);
  await writeTransaction(editUserRoleQuery, {
    info: { federationId, ...locationInfo },
    oldRole,
    newRole,
  });
  await sendSqsMessage(sqs(), 'audit-log-sqs', {
    updatedBy: adminId || 'SYSTEM',
    updatedTimestamp: moment().format(),
    transactionId: uuid(),
    application: 'User Admin',
    action: 'EDIT USER ROLE',
    field: 'USER',
    from: {
      federationId,
      sapAccountNumber: oldRole.locationId,
      roleName: oldRole.roleName,
      lobList: oldRole.lob,
    },
    to: {
      federationId,
      sapAccountNumber: newRole.locationId,
      roleName: newRole.roleName,
      lobList: newRole.lob,
    },
  });
  return { code: '200', message: 'The relationship was successfully updated' };
};

export const createUserAndLocationsService = async body => {
  const { locationRoles, ...userData } = body;
  const user = createUserObj(userData);
  console.log('---USER in persistence---', user);

  // get location info for all locations in request
  const locationPromises = locationRoles.map(async loc => {
    const sourceSystem = loc.sourceSystem ? loc.sourceSystem : 'sap-customer-number';
    return getLocation(loc.sapId, sourceSystem, user.country, user.portal);
  });
  const locationInfo = await Promise.all(locationPromises);
  /*
   * Lookup location info for hqSapId - TODO: take hqSapId from request
   * Once completed locationInfo loading can be deferred til after user creation
   * (await Promise.all can be moved to after userCreation writeTransaction)
   */
  const { hqSapId } = locationInfo[0];

  const [userCreationError, userCreationResult] = await to(writeTransaction(createUserQuery, { user, hqSapId }));

  if (userCreationError) {
    return { code: '500', message: `Failed to create user for reason: ${userCreationError}` };
  }

  // combine role and location info for query
  const [assignRolesError, assignRolesResult] = await to(writeListTransaction(
    addUserRoleByIdQuery,
    user,
    locationRoles,
  ));

  if (assignRolesError) {
    return { code: '207', message: [userCreationResult, `Failed to assign roles for reason: ${assignRolesError}`] };
  }

  await syncNewUserToCu360(body);

  await sendAuditMessage('ADD USER', 'USER', {},
    {
      federationId: user.federationId,
      sapAccountNumbers: locationRoles.map(loc => loc.sapId),
      roles: locationRoles.map(loc => loc.roleId),
    });
  return { code: '201', message: [userCreationResult, assignRolesResult] };
};


export const updateUserDataAndStatusService = async (identity, properties, requesterId) => {
  const { federationId, ...user } = identity;
  const { status } = properties;

  // update user status in gigya
  const [gigyaError, gigyaResult] = await to(updateUserGigyaStatus(federationId, status === 'active'));
  if (gigyaError) {
    return { code: '500', message: 'Error updating status' };
  }

  // update user status in neo4j
  const [dbError, dbResult] = await to(writeTransaction(updateUserDataQuery, { ...user, properties }));

  // failed to update in neo4j, roll back gigya updates
  if (dbError && gigyaResult.status === 200) {
    console.error('Error! User status updated in Gigya but failed in Neo4j. Attempting Gigya Rollback');
    const [rollbackError, rollbackResult] = await to(updateUserGigyaStatus(federationId, !(status === 'active')));
    // rollback failed, request retry
    if (rollbackError) {
      console.error('Critical Failure: User status rollback failed. Please try again or correct manually.');
      return { code: '503', message: [gigyaResult.data, dbError, rollbackError.message] };
    }
    console.info('Rollback successful');
    return { code: '500', message: [gigyaResult.data, dbError, rollbackResult.data] };
  }
  // eslint-disable-next-line no-else-return
  else {
    const message = {
      updatedBy: requesterId || 'SYSTEM',
      updatedTimestamp: moment().format(),
      transactionId: uuid(),
      application: 'User Admin',
      action: 'UPDATE USER STATUS',
      field: 'USER',
      from: {
      },
      to: {
        federationId,
        status,
      },
    };
    await sendSqsMessage(sqs(), 'audit-log-sqs', message);
    return { code: '200', message: [gigyaResult.data, dbResult] };
  }
};

// TODO: add audit trail for updates that are NOT timestamp updates
// unless we decide we want an audit log that includes every time a user logs in
export const updateUserDataService = async (identity, properties) => {
  await writeTransaction(updateUserDataQuery, { ...identity, properties });
  return { code: '200', message: 'Successfully updated' };
};

export const updateUserGigyaStatusService = async (federationId, isActive) => {
  const [error, result] = await to(updateUserGigyaStatus(federationId, isActive));
  if (error) {
    console.error(error);
    return { code: '500', message: error.message };
  }
  return { code: '200', message: result.data };
};

export default {
  addUserRoleService,
  deleteUserRoleService,
  editUserRoleService,
  getUserRolesService,
  getUserApplicationEntitlements,
  getUserEntitlements,
  getUserEntitlementsUserProfileService,
  getProfileByUserIdService,
  getProfileByFederationIdService,
  getAccountsByFedIdService,
  getAccountsByUserIdService,
};
