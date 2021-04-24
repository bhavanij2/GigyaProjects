export const padSapAccount = sapAccount => sapAccount.padStart(10, '0');
export const removeSapAccountPadding = paddedSapAccount => paddedSapAccount && paddedSapAccount.replace(/^0+/, '');

export const Neo4jEntityProperties = {
  user: [
    'id',
    'name',
    'hqSapId',
    'federationId',
    'brand',
    'persona',
    'first_name',
    'last_name',
    'address_line_1',
    'address_line_2',
    'city',
    'state',
    'country',
    'portal',
    'primary_phone',
    'primary_phone_type',
    'secondary_phone',
    'secondary_phone_type',
    'contact_glopid',
    'zipCode',
    'testUser',
  ],
  location: [
    'sapid',
    'streetAddress',
    'city',
    'state',
    'zipCode',
    'hqSapId',
    'name',
  ],
};

// maps request body to objects with neo4j properties
export const MapToNeo4jObj = (neo4jObjPropertyMap, body) => {
  const res = {};
  Object.entries(neo4jObjPropertyMap).forEach(([key, val]) => {
    res[key] = body[val] || '';
  });
  return res;
};
