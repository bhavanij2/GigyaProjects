import { writeTransactionReturnResult } from '../../../neo4j.utils';
import { createFeatureSetQuery } from '../queries';

async function createFeatureSetService(body) {
  const transactionResult = await writeTransactionReturnResult(createFeatureSetQuery, body);
  return transactionResult;
}

export default createFeatureSetService;
