// role-permission-relationships/admin.cypher
// give Admin (ad) MyAccount permissions


//
// menu
//

MATCH
  (r_seed:Role      {id: 'glb:seed:ad'}),
  (r_cp:Role        {id: 'glb:cp:ad'}),
  (r_acceleron:Role {id: 'glb:acceleron:ad'}),
  (r_bioag:Role     {id: 'glb:bioag:ad'}),

  (p_seed:Permission      {id: 'seed:user-admin:users'}),
  (p_cp:Permission        {id: 'cp:user-admin:users'}),
  (p_acceleron:Permission {id: 'acceleron:user-admin:users'}),
  (p_bioag:Permission     {id: 'bioag:user-admin:users'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'write'}]->(p_seed),
  (r_cp)-[:HAS_PERMISSION {type: 'write'}]->(p_cp),
  (r_acceleron)-[:HAS_PERMISSION {type: 'write'}]->(p_acceleron),
  (r_bioag)-[:HAS_PERMISSION {type: 'write'}]->(p_bioag);
  

MATCH
  (r_seed:Role      {id: 'glb:seed:ad'}),
  (r_cp:Role        {id: 'glb:cp:ad'}),
  (r_acceleron:Role {id: 'glb:acceleron:ad'}),
  (r_bioag:Role     {id: 'glb:bioag:ad'}),

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
  (r_seed:Role      {id: 'glb:seed:ad'}),

  (p_seed:Permission      {id: 'seed:myaccount:my-farmers'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed);


MATCH
  (r_seed:Role      {id: 'glb:seed:ad'}),
  (r_cp:Role        {id: 'glb:cp:ad'}),
  (r_acceleron:Role {id: 'glb:acceleron:ad'}),
  (r_bioag:Role     {id: 'glb:bioag:ad'}),

  (p_seed:Permission      {id: 'seed:myaccount:order-insights'}),
  (p_cp:Permission        {id: 'cp:myaccount:order-insights'}),
  (p_acceleron:Permission {id: 'acceleron:myaccount:order-insights'}),
  (p_bioag:Permission     {id: 'bioag:myaccount:order-insights'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed),
  (r_cp)-[:HAS_PERMISSION {type: 'read'}]->(p_cp),
  (r_acceleron)-[:HAS_PERMISSION {type: 'read'}]->(p_acceleron),
  (r_bioag)-[:HAS_PERMISSION {type: 'read'}]->(p_bioag);

MATCH
  (r_seed:Role      {id: 'glb:seed:ad'}),

  (p_seed:Permission      {id: 'seed:myaccount:inventory-insights'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed);


MATCH
  (r_seed:Role      {id: 'glb:seed:ad'}),
  (r_cp:Role        {id: 'glb:cp:ad'}),
  (r_acceleron:Role {id: 'glb:acceleron:ad'}),
  (r_bioag:Role     {id: 'glb:bioag:ad'}),

  (p_seed:Permission      {id: 'seed:myaccount:logistics-insights'}),
  (p_cp:Permission        {id: 'cp:myaccount:logistics-insights'}),
  (p_acceleron:Permission {id: 'acceleron:myaccount:logistics-insights'}),
  (p_bioag:Permission     {id: 'bioag:myaccount:logistics-insights'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed),
  (r_cp)-[:HAS_PERMISSION {type: 'read'}]->(p_cp),
  (r_acceleron)-[:HAS_PERMISSION {type: 'read'}]->(p_acceleron),
  (r_bioag)-[:HAS_PERMISSION {type: 'read'}]->(p_bioag);


MATCH
  (r_seed:Role      {id: 'glb:seed:ad'}),
  (r_cp:Role        {id: 'glb:cp:ad'}),
  (r_acceleron:Role {id: 'glb:acceleron:ad'}),
  (r_bioag:Role     {id: 'glb:bioag:ad'}),

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
  (r_seed:Role      {id: 'glb:seed:ad'}),

  (p_seed:Permission      {id: 'seed:myaccount:marketing-insights'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed);

