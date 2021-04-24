import { StatementResult, Record } from 'neo4j-driver/types/v1';

import { Neo4jEntityResultOptions } from '../types';
import { LoginDetails } from './types';

export function mapNeo4jStatementResultToLoginDetails(statementResult: StatementResult): LoginDetails[] {
  return statementResult.records.map((record: Record) => {
    const recordObject: Neo4jEntityResultOptions = record.toObject();
    return recordObject.user.properties;
  });
}
