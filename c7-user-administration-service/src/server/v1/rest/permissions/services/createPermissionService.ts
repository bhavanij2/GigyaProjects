import { writeTransactionReturnResult } from '../../../neo4j.utils';
import { createPermissionQuery } from '../queries';

async function createPermissionService(body) {
  const transactionResult = await writeTransactionReturnResult(createPermissionQuery, body);
  return transactionResult;
}

export default createPermissionService;
