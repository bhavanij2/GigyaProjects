// role-permission-relationships/marketing.cypher
// give Marketing (mkt) MyAccount permissions


//
// menu
//

MATCH
  (r_seed:Role      {id: 'glb:seed:mkt'}),
  (r_cp:Role        {id: 'glb:cp:mkt'}),
  (r_acceleron:Role {id: 'glb:acceleron:mkt'}),
  (r_bioag:Role     {id: 'glb:bioag:mkt'}),

  (p_seed:Permission      {id: 'seed:myaccount:my-company'}),
  (p_cp:Permission        {id: 'cp:myaccount:my-company'}),
  (p_acceleron:Permission {id: 'acceleron:myaccount:my-company'}),
  (p_bioag:Permission     {id: 'bioag:myaccount:my-company'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed),
  (r_cp)-[:HAS_PERMISSION {type: 'read'}]->(p_cp),
  (r_acceleron)-[:HAS_PERMISSION {type: 'read'}]->(p_acceleron),
  (r_bioag)-[:HAS_PERMISSION {type: 'read'}]->(p_bioag);


MATCH
  (r_seed:Role      {id: 'glb:seed:mkt'}),
  (r_cp:Role        {id: 'glb:cp:mkt'}),
  (r_acceleron:Role {id: 'glb:acceleron:mkt'}),
  (r_bioag:Role     {id: 'glb:bioag:mkt'}),

  (p_seed:Permission      {id: 'seed:myaccount:year-end-insights'}),
  (p_cp:Permission        {id: 'cp:myaccount:year-end-insights'}),
  (p_acceleron:Permission {id: 'acceleron:myaccount:year-end-insights'}),
  (p_bioag:Permission     {id: 'bioag:myaccount:year-end-insights'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed),
  (r_cp)-[:HAS_PERMISSION {type: 'read'}]->(p_cp),
  (r_acceleron)-[:HAS_PERMISSION {type: 'read'}]->(p_acceleron),
  (r_bioag)-[:HAS_PERMISSION {type: 'read'}]->(p_bioag);


MATCH
  (r_seed:Role      {id: 'glb:seed:mkt'}),

  (p_seed:Permission      {id: 'seed:myaccount:marketing-insights'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed);
