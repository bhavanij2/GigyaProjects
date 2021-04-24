// role-permission-relationships/branch-account.cypher
// give Branch Account (ba) Finance Permissions

MATCH
  (r_seed:Role      {id: 'glb:seed:ba'}),
  (r_bioag:Role     {id: 'glb:bioag:ba'}),
  (r_acceleron:Role {id: 'glb:acceleron:ba'}),
  (r_cp:Role        {id: 'glb:cp:ba'}),

  (p_seed:Permission      {id: 'seed:finance:account-activity'}),
  (p_bioag:Permission     {id: 'bioag:finance:account-activity'}),
  (p_acceleron:Permission {id: 'acceleron:finance:account-activity'}),
  (p_cp:Permission        {id: 'cp:finance:account-activity'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed),
  (r_cp)-[:HAS_PERMISSION {type: 'read'}]->(p_cp),
  (r_acceleron)-[:HAS_PERMISSION {type: 'read'}]->(p_acceleron),
  (r_bioag)-[:HAS_PERMISSION {type: 'read'}]->(p_bioag);


MATCH
  (r_seed:Role      {id: 'glb:seed:ba'}),
  (r_bioag:Role     {id: 'glb:bioag:ba'}),
  (r_acceleron:Role {id: 'glb:acceleron:ba'}),
  (r_cp:Role        {id: 'glb:cp:ba'}),

  (p_seed:Permission      {id: 'seed:finance:grower-credit'}),
  (p_bioag:Permission     {id: 'bioag:finance:grower-credit'}),
  (p_acceleron:Permission {id: 'acceleron:finance:grower-credit'}),
  (p_cp:Permission        {id: 'cp:finance:grower-credit'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed),
  (r_cp)-[:HAS_PERMISSION {type: 'read'}]->(p_cp),
  (r_acceleron)-[:HAS_PERMISSION {type: 'read'}]->(p_acceleron),
  (r_bioag)-[:HAS_PERMISSION {type: 'read'}]->(p_bioag);
