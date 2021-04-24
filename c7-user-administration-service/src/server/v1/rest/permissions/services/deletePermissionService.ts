import { writeTransactionReturnResult } from '../../../neo4j.utils';
import { deletePermissionQuery } from '../queries';

async function deletePermissionService(id) {
  const transactionResult = await writeTransactionReturnResult(deletePermissionQuery, id);
  return transactionResult;
}

export default deletePermissionService;
