import { zipObject, chain } from 'lodash';
import { readTransaction } from '../../../neo4j.utils';
import { getRolesQuery } from '../queries';

function removeRoleInfo(permissions) {
  return permissions.filter(p => p.action !== null).map(permission => {
    const {
      access, action, lob, permissionId, featureSet,
    } = permission;
    return {
      access, action, lob, permissionId, featureSet,
    };
  });
}

async function getRoles(params) {
  const result = await readTransaction(getRolesQuery(params));
  const rolePermissionObjects = result.records.map(record => zipObject(record.keys, record._fields));
  const permissionsByRole = chain(rolePermissionObjects).groupBy('roleId').value();
  const roleIds = Object.keys(permissionsByRole);
  const roleDefinitions = roleIds.map(roleId => {
    const {
      access, action, permissionId, featureSet, ...roleData
    } = permissionsByRole[roleId][0];
    return {
      ...roleData,
      permissions: removeRoleInfo(permissionsByRole[roleId]),
    };
  });
  return roleDefinitions;
}

export default getRoles;
