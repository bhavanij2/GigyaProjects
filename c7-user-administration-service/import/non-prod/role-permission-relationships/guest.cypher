// role-permission-relationships/guest.cypher
// give Guest (pay) finance permissions


//
// menu
//

MATCH
  (r_seed:Role      {id: 'glb:seed:pay'}),
  (r_cp:Role        {id: 'glb:cp:pay'}),
  (r_acceleron:Role {id: 'glb:acceleron:pay'}),
  (r_bioag:Role     {id: 'glb:bioag:pay'}),

  (p_seed:Permission      {id: 'seed:finance:guest-pay'}),
  (p_cp:Permission        {id: 'cp:finance:guest-pay'}),
  (p_acceleron:Permission {id: 'acceleron:finance:guest-pay'}),
  (p_bioag:Permission     {id: 'bioag:finance:guest-pay'})
CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed),
  (r_cp)-[:HAS_PERMISSION {type: 'read'}]->(p_cp),
  (r_acceleron)-[:HAS_PERMISSION {type: 'read'}]->(p_acceleron),
  (r_bioag)-[:HAS_PERMISSION {type: 'read'}]->(p_bioag);