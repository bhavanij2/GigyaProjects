// role-permission-relationships/finance.cypher
// give Finance (fin) finance permissions


//
// menu
//

MATCH
  (r_seed:Role      {id: 'glb:seed:fin'}),
  (r_cp:Role        {id: 'glb:cp:fin'}),
  (r_acceleron:Role {id: 'glb:acceleron:fin'}),
  (r_bioag:Role     {id: 'glb:bioag:fin'}),

  (p_seed:Permission      {id: 'seed:finance:account-activity'}),
  (p_bioag:Permission     {id: 'bioag:finance:account-activity'}),
  (p_acceleron:Permission {id: 'acceleron:finance:account-activity'}),
  (p_cp:Permission        {id: 'cp:finance:account-activity'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed),
  (r_bioag)-[:HAS_PERMISSION {type: 'read'}]->(p_bioag),
  (r_acceleron)-[:HAS_PERMISSION {type: 'read'}]->(p_acceleron),
  (r_cp)-[:HAS_PERMISSION {type: 'read'}]->(p_cp);


MATCH
  (r_seed:Role      {id: 'glb:seed:fin'}),
  (r_cp:Role        {id: 'glb:cp:fin'}),
  (r_acceleron:Role {id: 'glb:acceleron:fin'}),
  (r_bioag:Role     {id: 'glb:bioag:fin'}),

  (p_seed:Permission      {id: 'seed:finance:grower-credit'}),
  (p_bioag:Permission     {id: 'bioag:finance:grower-credit'}),
  (p_acceleron:Permission {id: 'acceleron:finance:grower-credit'}),
  (p_cp:Permission        {id: 'cp:finance:grower-credit'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed),
  (r_bioag)-[:HAS_PERMISSION {type: 'read'}]->(p_bioag),
  (r_acceleron)-[:HAS_PERMISSION {type: 'read'}]->(p_acceleron),
  (r_cp)-[:HAS_PERMISSION {type: 'read'}]->(p_cp);


MATCH
  (r_seed:Role      {id: 'glb:seed:fin'}),
  (r_cp:Role        {id: 'glb:cp:fin'}),
  (r_acceleron:Role {id: 'glb:acceleron:fin'}),
  (r_bioag:Role     {id: 'glb:bioag:fin'}),

  (p_seed:Permission      {id: 'seed:finance:payment'}),
  (p_bioag:Permission     {id: 'bioag:finance:payment'}),
  (p_acceleron:Permission {id: 'acceleron:finance:payment'}),
  (p_cp:Permission        {id: 'cp:finance:payment'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'write'}]->(p_seed),
  (r_bioag)-[:HAS_PERMISSION {type: 'write'}]->(p_bioag),
  (r_acceleron)-[:HAS_PERMISSION {type: 'write'}]->(p_acceleron),
  (r_cp)-[:HAS_PERMISSION {type: 'write'}]->(p_cp);


MATCH
  (r_seed:Role      {id: 'glb:seed:fin'}),
  (r_bioag:Role     {id: 'glb:bioag:fin'}),
  (r_acceleron:Role {id: 'glb:acceleron:fin'}),
  (r_cp:Role        {id: 'glb:cp:fin'}),

  (p_seed:Permission      {id: 'seed:finance:statements'}),
  (p_bioag:Permission     {id: 'bioag:finance:statements'}),
  (p_acceleron:Permission {id: 'acceleron:finance:statements'}),
  (p_cp:Permission        {id: 'cp:finance:statements'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed),
  (r_bioag)-[:HAS_PERMISSION {type: 'read'}]->(p_bioag),
  (r_acceleron)-[:HAS_PERMISSION {type: 'read'}]->(p_acceleron),
  (r_cp)-[:HAS_PERMISSION {type: 'read'}]->(p_cp);


MATCH
  (r_seed:Role      {id: 'glb:seed:fin'}),
  (r_cp:Role        {id: 'glb:cp:fin'}),
  (r_acceleron:Role {id: 'glb:acceleron:fin'}),
  (r_bioag:Role     {id: 'glb:bioag:fin'}),

  (p_seed:Permission      {id: 'seed:finance:payment-history'}),
  (p_bioag:Permission     {id: 'bioag:finance:payment-history'}),
  (p_acceleron:Permission {id: 'acceleron:finance:payment-history'}),
  (p_cp:Permission        {id: 'cp:finance:payment-history'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed),
  (r_bioag)-[:HAS_PERMISSION {type: 'read'}]->(p_bioag),
  (r_acceleron)-[:HAS_PERMISSION {type: 'read'}]->(p_acceleron),
  (r_cp)-[:HAS_PERMISSION {type: 'read'}]->(p_cp);

