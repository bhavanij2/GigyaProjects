
export const attachFeatureSetQuery = ({sapid, featureSetName, persona, lob, brand, country, portal}) => `
MATCH (l:Location { sapid: "${sapid}" })
MATCH (f:FeatureSet { name: "${featureSetName}" })
CREATE (l)-[:HAS_FEATURE_SET { persona: "${persona}", lob: "${lob}", brand: "${brand}", country: "${country}", portal: "{portal}"}]->(f)`;

export const detachFeatureSetQuery = ({sapid, featureSetName, persona, lob, brand, country, portal}) => `
MATCH (l:Location { sapid: "${sapid}" }) 
-[hfs:HAS_FEATURE_SET { persona: "${persona}", lob: "${lob}", brand: "${brand}", country: "${country}", portal: "{portal}"}]->
(f:FeatureSet { name: "${featureSetName}" })
DELETE hfs`;

export const changeLocationQuery = ({oldSapId, oldSourceSystem, newSapId, newSourceSystem}) => `
    match(u:User)-[hr:HAS_ROLE]->(oldSapId:Location { sapid: "${oldSapId}", sourceSystem: "${oldSourceSystem}" }) 
    match(newLocation:Location {sapid:"${newSapId}", sourceSystem: "${newSourceSystem}"}) 
    merge (u)-[:HAS_ROLE{id:hr.id}]->(newLocation)`;

    //Only for short term delete later & remove references to it.
export const tempUpdateOldLocationName = ({oldSapId, oldSourceSystem}) => `
    match(oldSapId:Location { sapid: "${oldSapId}", sourceSystem: "${oldSourceSystem}" }) 
    set oldSapId += {name: oldSapId.name+' sap', city: oldSapId.city+' sap'}`;