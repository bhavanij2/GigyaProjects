import {CreateFeatureSetBody} from "./types";
import {conditionalStringsFrom} from "../utils";

export const createFeatureSetQuery = (body: CreateFeatureSetBody) => `
    CREATE (f:FeatureSet { name: '${body.name}'})`;

export const deleteFeatureSetQuery = (name: string) => `
    MATCH (f:FeatureSet { name: '${name}' })
        DETACH DELETE f`;

export const getFeaturesSetQuery = () => 'MATCH (f:FeatureSet) RETURN f';

// export const getFeatureSetsQuery = query => {
//   const [conditionalStrings, AND] = conditionalStringsFrom(query, false, 'f');
//   return `MATCH (f:FeatureSet)
//         OPTIONAL MATCH (l:Location) -[hfs:HAS_FEATURE_SET]-> (f)
//         WITH l,hfs,f
//         ${Object.keys(conditionalStrings).map(k => conditionalStrings[k]).join('\n\t')}
//         RETURN f, collect(l) as locations`;
// };
