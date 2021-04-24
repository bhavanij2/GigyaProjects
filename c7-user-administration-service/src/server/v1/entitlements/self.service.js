import {
  zipObject,
  chain,
} from 'lodash';
import {
  allPermissions,
  allPermissionsByApplication,
  assignRolesPermissionsQuery,
  deleteRolesPermissionsQuery,
  permissionsByRoleQuery,
  assignTestRolesPermissionsQuery,
} from '../queries.util';
import { writeListTransaction, readTransaction } from '../neo4j.utils';
import { sendAuditMessage } from '../../sqs.utils';

export const getPermissionsByRole = async roleName => {
  const query = permissionsByRoleQuery(roleName);
  const dbResult = await readTransaction(query);
  const result = chain(dbResult.records)
    .map(record => zipObject(record.keys, record._fields))
    .value();
  return { code: '200', message: result };
};

export const adjustList = (roleName, permissionsList) => chain(permissionsList)
  .map(permission => ({
    lob: permission.id.split(':')[0],
    ...permission,
    roleName,
  })).value();

export const assignPrimaryRolesPermissions = async (roleName, permissionsList, userProfile) => {
  const adjustedList = adjustList(roleName, permissionsList);
  const result = await writeListTransaction(assignRolesPermissionsQuery, roleName, adjustedList);
  const permissions = JSON.stringify(permissionsList);
  await sendAuditMessage('ASSIGN PERMISSIONS', 'ROLE', {}, { roleName, permissions }, userProfile.federationId);
  return { code: '200', message: result };
};

export const assignTestRolesPermissions = async (roleName, roleLob, permissionsList, userProfile) => {
  const adjustedList = adjustList(roleName, permissionsList);
  const roleInfo = { roleName, roleLob };
  const result = await writeListTransaction(assignTestRolesPermissionsQuery, roleInfo, adjustedList);
  const permissions = JSON.stringify(permissionsList);
  await sendAuditMessage('ASSIGN PERMISSIONS', 'ROLE', {}, { roleName, permissions }, userProfile.federationId);
  return { code: '200', message: result };
};

export const assignRolesPermissions = async (roleName, permissionsList, roleLob, userProfile) => {
  if (roleLob === '*') {
    assignTestRolesPermissions(roleName, roleLob, permissionsList, userProfile);
    return { code: '201', message: `Permissions were added to testing role ${roleName}` };
  }
  if (roleLob === undefined) {
    await assignPrimaryRolesPermissions(roleName, permissionsList, userProfile);
    return { code: '201', message: `Permissions were added to role ${roleName}` };
  }
  return { code: '404', message: 'Optional Role Lob optional parameter must be * or empty' };
};

export const deleteRolesPermissions = async (roleName, permissionsList, userProfile) => {
  const result = await writeListTransaction(deleteRolesPermissionsQuery, roleName, permissionsList);
  const permissions = JSON.stringify(permissionsList);
  await sendAuditMessage('DELETE PERMISSIONS', 'ROLE', { roleName, permissions }, { }, userProfile.federationId);
  return { code: '200', message: result };
};

export const getPermissions = async application => {
  const query = application ? allPermissionsByApplication(application) : allPermissions();
  const result = await readTransaction(query);
  return chain(result.records)
    .map(record => zipObject(record.keys, record._fields))
    .value();
};

export default assignRolesPermissions;
