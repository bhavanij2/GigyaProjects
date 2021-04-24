// role-permission-relationships/channel-seedsman.cypher
// give Channel Seedsman (ch) Finance and MyAccount Permissions

MATCH
  (r_seed:Role      {id: 'glb:seed:ch'}),
  (r_bioag:Role     {id: 'glb:bioag:ch'}),
  (r_acceleron:Role {id: 'glb:acceleron:ch'}),
  
  (p_seed:Permission      {id: 'seed:finance:grower-credit'}),
  (p_bioag:Permission     {id: 'bioag:finance:grower-credit'}),
  (p_acceleron:Permission {id: 'acceleron:finance:grower-credit'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed),
  (r_acceleron)-[:HAS_PERMISSION {type: 'read'}]->(p_acceleron),
  (r_bioag)-[:HAS_PERMISSION {type: 'read'}]->(p_bioag);



MATCH
  (r_seed:Role      {id: 'glb:seed:ch'}),
  
  (p_seed:Permission      {id: 'seed:myaccount:my-farmers'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed);



MATCH
  (r_seed:Role      {id: 'glb:seed:ch'}),
  
  (p_seed:Permission      {id: 'seed:myaccount:order-insights'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed);



MATCH
  (r_seed:Role      {id: 'glb:seed:ch'}),
  
  (p_seed:Permission      {id: 'seed:myaccount:inventory-insights'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed);



MATCH
  (r_seed:Role      {id: 'glb:seed:ch'}),
  
  (p_seed:Permission      {id: 'seed:myaccount:logistics-insights'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed);



MATCH
  (r_seed:Role      {id: 'glb:seed:ch'}),
  
  (p_seed:Permission      {id: 'seed:myaccount:agronomic-insights'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed);



MATCH
  (r_seed:Role      {id: 'glb:seed:ch'}),
  
  (p_seed:Permission      {id: 'seed:myaccount:year-end-insights'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed);



