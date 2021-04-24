
MATCH
  (r_seed:Role      {id: 'glb:seed:nbfarm'}),
  (r_bioag:Role     {id: 'glb:bioag:nbfarm'}),
  (r_acceleron:Role {id: 'glb:acceleron:nbfarm'}),

  (p_seed:Permission      {id: 'seed:finance:farmflex-credit'}),
  (p_bioag:Permission     {id: 'bioag:finance:farmflex-credit'}),
  (p_acceleron:Permission {id: 'acceleron:finance:farmflex-credit'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed),
  (r_bioag)-[:HAS_PERMISSION {type: 'read'}]->(p_bioag),
  (r_acceleron)-[:HAS_PERMISSION {type: 'read'}]->(p_acceleron);


MATCH
  (r_seed:Role      {id: 'glb:seed:nbfarm'}),
  (r_bioag:Role     {id: 'glb:bioag:nbfarm'}),
  (r_acceleron:Role {id: 'glb:acceleron:nbfarm'}),

  (p_seed:Permission      {id: 'seed:finance:payment'}),
  (p_bioag:Permission     {id: 'bioag:finance:payment'}),
  (p_acceleron:Permission {id: 'acceleron:finance:payment'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'write'}]->(p_seed),
  (r_bioag)-[:HAS_PERMISSION {type: 'write'}]->(p_bioag),
  (r_acceleron)-[:HAS_PERMISSION {type: 'write'}]->(p_acceleron);


MATCH
  (r_seed:Role      {id: 'glb:seed:nbfarm'}),
  (r_bioag:Role     {id: 'glb:bioag:nbfarm'}),
  (r_acceleron:Role {id: 'glb:acceleron:nbfarm'}),

  (p_seed:Permission      {id: 'seed:finance:statements'}),
  (p_bioag:Permission     {id: 'bioag:finance:statements'}),
  (p_acceleron:Permission {id: 'acceleron:finance:statements'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed),
  (r_bioag)-[:HAS_PERMISSION {type: 'read'}]->(p_bioag),
  (r_acceleron)-[:HAS_PERMISSION {type: 'read'}]->(p_acceleron);


MATCH
  (r_seed:Role      {id: 'glb:seed:nbfarm'}),
  (r_bioag:Role     {id: 'glb:bioag:nbfarm'}),
  (r_acceleron:Role {id: 'glb:acceleron:nbfarm'}),

  (p_seed:Permission      {id: 'seed:finance:payment-history'}),
  (p_bioag:Permission     {id: 'bioag:finance:payment-history'}),
  (p_acceleron:Permission {id: 'acceleron:finance:payment-history'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed),
  (r_bioag)-[:HAS_PERMISSION {type: 'read'}]->(p_bioag),
  (r_acceleron)-[:HAS_PERMISSION {type: 'read'}]->(p_acceleron);
