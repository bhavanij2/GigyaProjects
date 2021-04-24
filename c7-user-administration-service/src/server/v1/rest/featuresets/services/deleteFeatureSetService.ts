import { writeTransactionReturnResult } from '../../../neo4j.utils';
import { deleteFeatureSetQuery } from '../queries';

async function deleteFeatureSetService(name) {
  const transactionResult = await writeTransactionReturnResult(deleteFeatureSetQuery, name);
  return transactionResult;
}

export default deleteFeatureSetService;
