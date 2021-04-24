import { writeTransactionReturnResult } from '../../../neo4j.utils';

import { PartialRole } from '../types';
import { duplicateUserRoleQuery, duplicateRolePermissionQuery, updatePartialRoleQuery } from '../queries';

const updateOldRole = async (roleId, role) => {
    if(role.newRoleId) {
        console.log('Updating role relationships')
        const userRoleResults = await writeTransactionReturnResult(duplicateUserRoleQuery, {oldRoleId: roleId, role});
        const rolePermissionResults = await writeTransactionReturnResult(duplicateRolePermissionQuery, {oldRoleId: roleId, role});
        return { 
            userRoleResults: userRoleResults.counters,
            rolePermissionResults: rolePermissionResults.counters
        };
    }
}
async function updatePartialRole(
  roleId: string,
  role: PartialRole,
) {
    const duplicateRoleResults = await updateOldRole(roleId, role)
    const updateRoleResults = await writeTransactionReturnResult(updatePartialRoleQuery, {roleId, role});
    return {
        duplicateRoleResults,
        updateRoleResults: updateRoleResults.counters
    }
}

export default updatePartialRole;