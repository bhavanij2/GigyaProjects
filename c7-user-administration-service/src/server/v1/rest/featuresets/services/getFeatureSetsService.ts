import { Record } from 'neo4j-driver/types/v1';

import { Neo4JFeatureSetResult } from '../types';
import { readTransaction } from '../../../neo4j.utils';
import { getFeaturesSetQuery } from '../queries';

async function getFeatureSetsService() {
  const q = getFeaturesSetQuery();
  const transactionResult = await readTransaction(q);
  const records = transactionResult.records.map((record: Record) => {
    const recordObject: Neo4JFeatureSetResult = record.toObject();
    return { ...recordObject.f.properties };
  });
  return records;
}

export default getFeatureSetsService;
