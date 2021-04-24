import { writeTransactionReturnResult } from '../../../neo4j.utils';

import { sendAuditMessage } from "../../../../sqs.utils";
import { deleteRoleQuery, deleteUserRoleRelationshipQuery } from '../queries';

async function deleteRole(
  roleId: string,
  userProfile: any,
) {
  const deleteUserRoleResult = await writeTransactionReturnResult(deleteUserRoleRelationshipQuery, roleId);
  const deleteRoleResult = await writeTransactionReturnResult(deleteRoleQuery, roleId);
  await sendAuditMessage('DELETE ROLE', 'ROLE', { roleId }, {}, userProfile.federationId);
  return {
    deleteUserRoleResult,
    deleteRoleResult
  };
}

export default deleteRole;
