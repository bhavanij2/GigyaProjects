import { writeTransactionReturnResult } from '../../../neo4j.utils';
import { attachFeatureSetQuery } from '../queries';

async function attachFeatureSetService(params) {
  const transactionResult = await writeTransactionReturnResult(
    attachFeatureSetQuery,
    params
  );
  return transactionResult;
}

export default attachFeatureSetService;
