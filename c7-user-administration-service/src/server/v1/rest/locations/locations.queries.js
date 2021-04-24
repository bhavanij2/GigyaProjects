import { removeEmptyValues } from '../utils.ts';

const util = require('util');

const addConditional = info => `${info.offset ? `where l.offset < ${info.offset}` : ''}`;

export const attachFeatureSetClause = (name, featureSet) => featureSet.map(f => {
  const { brand, persona, lob, country, portal } = f;
  return `WITH l
  MATCH (f:FeatureSet { name: "${name}"})
  MERGE (l)-[:HAS_FEATURE_SET { brand: "${brand}", persona: "${persona}", lob: "${lob}", country: "${country}", portal: "${portal}"}]->(f)`;
});

export const updateLocationInfoQuery = ({ sapId, info, featureSets }) => `
  MATCH (l:Location {sapid: "${sapId}"})
  ${addConditional(info)}
  SET l += ${util.inspect(removeEmptyValues(info))}
  WITH l
  OPTIONAL MATCH (l)-[hfs:HAS_FEATURE_SET]->(:FeatureSet {name: "payer"})
  DELETE hfs
  ${Object.keys(featureSets).map(fs => attachFeatureSetClause(fs, featureSets[fs]).join('\n')).join('\n')}
  RETURN l;`;

export const fetchLocationsQuery = () => 'MATCH (l:Location) RETURN l.sapid as sapId, l.hqsapid as hqSapId, '
  + 'l.name as name, l.streetAssress as streetAddress, l.city as city, l.state as state, l.zipCode as zipCode, l.payer as payer;';

export default {
  fetchLocationsQuery,
  updateLocationInfoQuery,
};
