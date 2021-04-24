import { writeTransactionReturnResult } from '../../../neo4j.utils';
import { detachFeatureSetQuery } from '../queries';

async function detachFeatureSetService(params) {
  const transactionResult = await writeTransactionReturnResult(
    detachFeatureSetQuery,
    params
  );
  return transactionResult;
}

export default detachFeatureSetService;
