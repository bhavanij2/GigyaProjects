import { Neo4jLocationResultNode } from '../types';
export { ErrorResponse, SuccessResponse } from '../types';

export interface CreateFeatureSetBody {
  name: string;
}

export interface Neo4JFeatureSetResult {
  f?: Neo4JFeatureSetResultNode;
  locations?: Neo4jLocationResultNode[];
}

export interface Neo4JFeatureSetResultNode {
  properties: FeatureSet;
}

export interface FeatureSet {
  name: string;
}