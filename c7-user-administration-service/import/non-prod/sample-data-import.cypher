// clear a database and fill it with sample content
// this will delete everything you have!
// see project README for more directions

//
// first clear out everything preexisting
//
MATCH (n) DETACH DELETE (n);

//
// create users and locations
//

CREATE
  (:User {id: 'applesauce@gmail.com', name: 'Alice Abana', hqSapId: '0001022461', federationId: '1238', brand: 'national', persona: 'dealer', glopid: '123452abcdefm', first_name: 'Alice', last_name: 'Abana', address_line_1: '800 Monsanto Drive', address_line_2: '', city: 'St.louis', state: 'MO', zip: '63303', mobile_phone: '314-694-1000', home_phone: '314-694-1000', contact_glopid: 'test1'}),
  (:User {id: 'brittlepeanut@yahoo.com', name: 'Bob Bismuth', hqSapId: '0001022461', federationId: '1237', brand: 'national', persona: 'dealer', glopid: '123451abcdefl', first_name: 'Bob', last_name: 'Bismuth', address_line_1: '800 Monsanto Drive', address_line_2: '', city: 'St.louis', state: 'MO', zip: '63303', mobile_phone: '314-694-1000', home_phone: '314-694-1000', contact_glopid: 'test1'}),
  (:User {id: 'carolinaliar@mailinator.com', name: 'Cheryl Carnestingbird', hqSapId: '0001022461', federationId: '1236', brand: 'national', persona: 'dealer', glopid: '123450abcdefk', first_name: 'Cheryl', last_name: 'Carnestingbird', address_line_1: '800 Monsanto Drive', address_line_2: '', city: 'St.louis', state: 'MO', zip: '63303', mobile_phone: '314-694-1000', home_phone: '314-694-1000', contact_glopid: 'test1'}),
  (:User {id: 'jonathan.doesworth@google.co.uk', name: 'Jon Doe', hqSapId: '0001022461', federationId: '1235', brand: 'national', persona: 'dealer', glopid: '123459abcdefj', first_name: 'Alice', last_name: 'Abana', address_line_1: '800 Monsanto Drive', address_line_2: '', city: 'St.louis', state: 'MO', zip: '63303', mobile_phone: '314-694-1000', home_phone: '314-694-1000', contact_glopid: 'test1'}),
  (:User {id: 'jon.doe@doeseed.com', name: 'Jon Doe', hqSapId: '0001022461', federationId: '1234', brand: 'national', persona: 'dealer', glopid: '123458abcdefi', first_name: 'Jon', last_name: 'Doe', address_line_1: '800 Monsanto Drive', address_line_2: '', city: 'St.louis', state: 'MO', zip: '63303', mobile_phone: '314-694-1000', home_phone: '314-694-1000', contact_glopid: 'test1'}),
  (:User {id: 'tim.nilles@example.com', name: 'Tim Nilles', hqSapId: '0001013083', federationId: '1233', brand: 'national', persona: 'dealer', glopid: '123457abcdefh', first_name: 'Tim', last_name: 'Nilles', address_line_1: '800 Monsanto Drive', address_line_2: '', city: 'St.louis', state: 'MO', zip: '63303', mobile_phone: '314-694-1000', home_phone: '314-694-1000', contact_glopid: 'a58a9c92-63e8-4000-8b03-39963b88f846'});
CREATE
  (:Location {sapid: '0001022461', name: 'CARLSON SEED INC', streetAddress: '1978 310TH ST', city: 'BLANCHARD', state: 'IA', hqSapId: '0001022461', zipCode: '516304015'}),
  (:Location {sapid: '0001022462', name: 'NB Dealer WI', streetAddress: '5432 That Street', city: 'Potosi', state: 'WI', hqSapId: '0001022461', zipCode: '63123'}),
  (:Location {sapid: '0001002606', name: 'GROWMARK INC HQ BLOOMINGTON', streetAddress: '1701 N TOWANDA AVE', city: 'BLOOMINGTON', state: 'IL', hqSapId: '0001002606', zipCode: "617012057"});

//
// create user entitlements
//

MATCH (u:User {id: 'brittlepeanut@yahoo.com'}), (l:Location {sapid: '0001022461'})
CREATE (u)-[:HAS_ROLE {id: 'glb:seed:fin'}] -> (l);

MATCH (u:User {id: 'brittlepeanut@yahoo.com'}), (l:Location {sapid: '0001022462'})
CREATE (u)-[:HAS_ROLE {id: 'glb:seed:om'}] -> (l);

MATCH (u:User {id: 'applesauce@gmail.com'}), (l:Location {sapid: '0001022461'})
CREATE (u)-[:HAS_ROLE {id: 'glb:cp:fin'}] -> (l);

MATCH (u:User {id: 'applesauce@gmail.com'}), (l:Location {sapid: '0001022461'})
CREATE (u)-[:HAS_ROLE {id: 'glb:seed:fin'}] -> (l);

MATCH (u:User {id: 'jon.doe@doeseed.com'}), (l:Location {sapid: '0001022461'})
CREATE (u)-[:HAS_ROLE {id: 'glb:bioag:fin'}] -> (l);

MATCH (u:User {id: 'jon.doe@doeseed.com'}), (l:Location {sapid: '0001022461'})
CREATE (u)-[:HAS_ROLE {id: 'glb:seed:om'}] -> (l);

MATCH (u:User {id: 'tim.nilles@example.com'}), (l:Location {sapid: '0001022461'})
CREATE (u)-[:HAS_ROLE {id: 'glb:seed:ad'}] -> (l);

MATCH (u:User {id: 'applesauce@gmail.com'}), (l:Location {sapid: '0001022461'})
CREATE (u)-[:HAS_ROLE {id: 'glb:cp:ad'}] -> (l);

MATCH (u:User {id: 'applesauce@gmail.com'}), (l:Location {sapid: '0001022461'})
CREATE (u)-[:HAS_ROLE {id: 'glb:seed:ad'}] -> (l);

MATCH (u:User {id: 'tim.nilles@example.com'}), (l:Location {sapid: '0001002606'})
CREATE (u)-[:HAS_ROLE {id: 'glb:cp:ad'}] -> (l);

MATCH (u:User {id: 'tim.nilles@example.com'}), (l:Location {sapid: '0001002606'})
CREATE (u)-[:HAS_ROLE {id: 'glb:seed:ad'}] -> (l);