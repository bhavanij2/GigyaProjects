import { writeTransaction } from '../../../neo4j.utils';
import { AddRoleRequestBody } from '../types';
import { addRoleQuery } from '../queries';
import { sendAuditMessage } from '../../../../sqs.utils';

async function addRole(
  roleBody: AddRoleRequestBody, userProfile: any) {
  const transactionResult: string = await writeTransaction(addRoleQuery, roleBody);
  const roleName = roleBody.name;
  await sendAuditMessage('ADD ROLE', 'ROLE', {}, { roleName }, userProfile.federationId);
  return transactionResult;
}

export default addRole;
