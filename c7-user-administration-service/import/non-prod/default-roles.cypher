// default-roles.cypher
// adds global roles

// Test Roles for all brand and persona combinations
CREATE
  (:Role {id: 'glb:*:nbdealer',       name: 'National Dealer Test Role', scope:'global', lob: '*'}),
  (:Role {id: 'glb:*:chseedsman',       name: 'Channel Seedsman Test Role', scope:'global', lob: '*'}),
  (:Role {id: 'glb:*:chfarmer',       name: 'Channel Farmer Test Role', scope:'global', lob: '*'}),
  (:Role {id: 'glb:*:nbfarmer',       name: 'National Farmer Test Role', scope:'global', lob: '*'});


// Channel Farmer Owner
CREATE
  (:Role {id: 'glb:seed:chfarm',       name: 'Channel Farmer Owner', scope:'global', lob: 'seed', brand: 'channel', persona: 'farmer'}),
  (:Role {id: 'glb:bioag:chfarm',       name: 'Channel Farmer Owner', scope:'global', lob: 'bioag', brand: 'channel', persona: 'farmer'}),
  (:Role {id: 'glb:acceleron:chfarm',       name: 'Channel Farmer Owner', scope:'global', lob: 'acceleron', brand: 'channel', persona: 'farmer'});

// National Brand Farmer Owner
CREATE
  (:Role {id: 'glb:seed:nbfarm',       name: 'Farmer Owner', scope:'global', lob: 'seed', brand: 'national', persona: 'farmer'}),
  (:Role {id: 'glb:bioag:nbfarm',       name: 'Farmer Owner', scope:'global', lob: 'bioag', brand: 'national', persona: 'farmer'}),
  (:Role {id: 'glb:acceleron:nbfarm',       name: 'Farmer Owner', scope:'global', lob: 'acceleron', brand: 'national', persona: 'farmer'});

// Branch Account - for Finance
CREATE
  (:Role {id: 'glb:seed:ba',       name: 'Branch Account', scope:'global', lob: 'seed', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:bioag:ba',       name: 'Branch Account', scope:'global', lob: 'bioag', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:acceleron:ba',       name: 'Branch Account', scope:'global', lob: 'acceleron', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:cp:ba',         name: 'Branch Account', scope:'global', lob: 'cp', brand: 'national', persona: 'dealer'});

// Channel Seedsman
CREATE
  (:Role {id: 'glb:seed:ch',       name: 'Channel Seedsman', scope:'global', lob: 'seed', brand: 'channel', persona: 'dealer'}),
  (:Role {id: 'glb:acceleron:ch',  name: 'Channel Seedsman', scope:'global', lob: 'acceleron', brand: 'channel', persona: 'dealer'}),
  (:Role {id: 'glb:bioag:ch',      name: 'Channel Seedsman', scope:'global', lob: 'bioag', brand: 'channel', persona: 'dealer'});


// #1 Admin (ad)
// Back-up/Delegate admin; the ability to assign roles to other users at the respective location
CREATE
  (:Role {id: 'glb:seed:ad',       name: 'Admin', scope:'global', lob: 'seed', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:cp:ad',         name: 'Admin', scope:'global', lob: 'cp', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:acceleron:ad',  name: 'Admin', scope:'global', lob: 'acceleron', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:bioag:ad',      name: 'Admin', scope:'global', lob: 'bioag', brand: 'national', persona: 'dealer'});

// #2 Site Manager (sm)
// Has overall responsibility for running the location
CREATE
  (:Role {id: 'glb:seed:sm',       name: 'Site Manager', scope:'global', lob: 'seed', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:cp:sm',         name: 'Site Manager', scope:'global', lob: 'cp', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:acceleron:sm',  name: 'Site Manager', scope:'global', lob: 'acceleron', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:bioag:sm',      name: 'Site Manager', scope:'global', lob: 'bioag', brand: 'national', persona: 'dealer'});

// #3 Office Manager (om)
// Overall responsibility for all administrative activities 
CREATE
  (:Role {id: 'glb:seed:om',       name: 'Office Manager', scope:'global', lob: 'seed', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:cp:om',         name: 'Office Manager', scope:'global', lob: 'cp', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:acceleron:om',  name: 'Office Manager', scope:'global', lob: 'acceleron', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:bioag:om',      name: 'Office Manager', scope:'global', lob: 'bioag', brand: 'national', persona: 'dealer'});

// #4 Warehouse (wh)
// Performs all warehouse activities
CREATE
  (:Role {id: 'glb:seed:wh',       name: 'Warehouse', scope:'global', lob: 'seed', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:cp:wh',         name: 'Warehouse', scope:'global', lob: 'cp', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:acceleron:wh',  name: 'Warehouse', scope:'global', lob: 'acceleron', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:bioag:wh',      name: 'Warehouse', scope:'global', lob: 'bioag', brand: 'national', persona: 'dealer'});

// #5 Sales (sa)
// Responsible for any/all Sales Activities
CREATE
  (:Role {id: 'glb:seed:sa',       name: 'Sales', scope:'global', lob: 'seed', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:cp:sa',         name: 'Sales', scope:'global', lob: 'cp', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:acceleron:sa',  name: 'Sales', scope:'global', lob: 'acceleron', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:bioag:sa',      name: 'Sales', scope:'global', lob: 'bioag', brand: 'national', persona: 'dealer'});

// #6 Finance (fin)
// Performs all Financial Activities to include bill pay
CREATE
  (:Role {id: 'glb:seed:fin',      name: 'Finance', scope:'global', lob: 'seed', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:cp:fin',        name: 'Finance', scope:'global', lob: 'cp', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:acceleron:fin', name: 'Finance', scope:'global', lob: 'acceleron', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:bioag:fin',     name: 'Finance', scope:'global', lob: 'bioag', brand: 'national', persona: 'dealer'});

// #7 Agronomy (ag)
// Consultant to salesmen and growers to assist in selecting best products for their fields.
CREATE
  (:Role {id: 'glb:seed:ag',       name: 'Agronomy', scope:'global', lob: 'seed', brand: 'channel', persona: 'dealer'}),
  (:Role {id: 'glb:cp:ag',         name: 'Agronomy', scope:'global', lob: 'cp', brand: 'channel', persona: 'dealer'}),
  (:Role {id: 'glb:acceleron:ag',  name: 'Agronomy', scope:'global', lob: 'acceleron', brand: 'channel', persona: 'dealer'}),
  (:Role {id: 'glb:bioag:ag',      name: 'Agronomy', scope:'global', lob: 'bioag', brand: 'channel', persona: 'dealer'});

// #8 Marketing (mkt)
// Responsible for marketing activates
CREATE
  (:Role {id: 'glb:seed:mkt',      name: 'Marketing', scope:'global', lob: 'seed', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:cp:mkt',        name: 'Marketing', scope:'global', lob: 'cp', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:acceleron:mkt', name: 'Marketing', scope:'global', lob: 'acceleron', brand: 'national', persona: 'dealer'}),
  (:Role {id: 'glb:bioag:mkt',     name: 'Marketing', scope:'global', lob: 'bioag', brand: 'national', persona: 'dealer'});


// #10 Guest (pay)
// Enables 1 off payers who are not set up to make payments on regular basis.
CREATE
  (:Role {id: 'glb:seed:pay',      name: 'Guest', scope:'global', lob: 'seed'}),
  (:Role {id: 'glb:cp:pay',        name: 'Guest', scope:'global', lob: 'cp'}),
  (:Role {id: 'glb:acceleron:pay', name: 'Guest', scope:'global', lob: 'acceleron'}),
  (:Role {id: 'glb:bioag:pay',     name: 'Guest', scope:'global', lob: 'bioag'});

