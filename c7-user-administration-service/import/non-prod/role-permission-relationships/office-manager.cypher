// role-permission-relationships/office-manager.cypher
// give Office Manager (om) MyAccount and Finance permissions


//
// menu
//


MATCH
  (r_seed:Role      {id: 'glb:seed:om'}),
  (r_bioag:Role     {id: 'glb:bioag:om'}),
  (r_acceleron:Role {id: 'glb:acceleron:om'}),
  (r_cp:Role        {id: 'glb:cp:om'}),

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
  (r_seed:Role      {id: 'glb:seed:om'}),
  (r_bioag:Role     {id: 'glb:bioag:om'}),
  (r_acceleron:Role {id: 'glb:acceleron:om'}),
  (r_cp:Role        {id: 'glb:cp:om'}),

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
  (r_seed:Role      {id: 'glb:seed:om'}),
  (r_bioag:Role     {id: 'glb:bioag:om'}),
  (r_acceleron:Role {id: 'glb:acceleron:om'}),
  (r_cp:Role        {id: 'glb:cp:om'}),

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
  (r_seed:Role      {id: 'glb:seed:om'}),
  (r_cp:Role        {id: 'glb:cp:om'}),
  (r_acceleron:Role {id: 'glb:acceleron:om'}),
  (r_bioag:Role     {id: 'glb:bioag:om'}),

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
  (r_seed:Role      {id: 'glb:seed:om'}),

  (p_seed:Permission      {id: 'seed:myaccount:my-farmers'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed);


MATCH
  (r_seed:Role      {id: 'glb:seed:om'}),
  (r_cp:Role        {id: 'glb:cp:om'}),
  (r_acceleron:Role {id: 'glb:acceleron:om'}),
  (r_bioag:Role     {id: 'glb:bioag:om'}),

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
  (r_seed:Role      {id: 'glb:seed:om'}),

  (p_seed:Permission      {id: 'seed:myaccount:inventory-insights'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed);


MATCH
  (r_seed:Role      {id: 'glb:seed:om'}),
  (r_cp:Role        {id: 'glb:cp:om'}),
  (r_acceleron:Role {id: 'glb:acceleron:om'}),
  (r_bioag:Role     {id: 'glb:bioag:om'}),

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
  (r_seed:Role      {id: 'glb:seed:om'}),
  (r_cp:Role        {id: 'glb:cp:om'}),
  (r_acceleron:Role {id: 'glb:acceleron:om'}),
  (r_bioag:Role     {id: 'glb:bioag:om'}),

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
  (r_seed:Role      {id: 'glb:seed:om'}),

  (p_seed:Permission      {id: 'seed:myaccount:marketing-insights'})

CREATE
  (r_seed)-[:HAS_PERMISSION {type: 'read'}]->(p_seed);

