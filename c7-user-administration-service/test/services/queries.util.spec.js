import {
  getUsersWithRolesByLocationQuery,
  deleteUserQuery,
  getUserAdminLocationsQuery,
  rolesConditional,
} from '../../src/server/v1/queries.util';
import {
  getOptionalParamsList,
  getUserInfoQuery,
  getUserRolesQuery,
  getUserApplicationEntitlementsQuery,
  getUserEntitlementsQuery,
  getHqSapIdQuery,
  getUserProfileQueryByUserId,
  getUserProfileQueryByFedId,
  addUserRoleByIdQuery,
  addUserRoleQuery,
  deleteUserRoleQuery,
  editUserRoleQuery,
} from '../../src/server/v1/rest/users/users.queries';
import {
  updateLocationInfoQuery,
} from '../../src/server/v1/rest/locations/locations.queries';
import {
  translators
} from '../../src/server/v1/rest/utils';


describe('queries', () => {
  it('getAllUserEntitlementsQuery returns the correct query and variable', () => {
    const federationId = '1234-5678-9876';

    const result = getUserEntitlementsQuery('1234-5678-9876');

    const expected = `MATCH (u:User {federationId: "${federationId}"})-[hr:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id: hr.id}) -[hp:HAS_PERMISSION]-> (p:Permission)
    WHERE (NOT EXISTS(hp.featureset)
    OR (l) -[:HAS_FEATURE_SET {country:r.country, brand:r.brand, persona:r.persona, lob: r.lob}]-> (:FeatureSet {name: hp.featureset}))
    
    RETURN u.id as userId, l.sapid as sapAccountId, hp.type as permissionType, p.action as action, p.id as pid`;
    expect(result).toEqual(expected);
  });


  it('getUsersWithRolesByLocationQuery returns the correct query and variable', () => {
    const sapId = '123456';

    const result = getUsersWithRolesByLocationQuery('123456');

    const expected = `
    MATCH (u:User)-[e:HAS_ROLE]->(l:Location { sapid: "${sapId}" })
    MATCH (r:Role {id: e.id})
    RETURN u.id as userId, u.name as userName, l.sapid as sapAccountId,
    l.name as sapAccountName, r.id as roleId, r.name as roleName, r.lob as lob`;
    expect(result).toEqual(expected);
  });

  it('getUserRolesQuery returns the correct query and variable', () => {
    const federationId = '1234-5678-9876';

    const result = getUserRolesQuery('1234-5678-9876');

    const expected = `
    MATCH (u:User {federationId: "${federationId}"})-[assignment:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id: assignment.id})
    RETURN u.id as userId, u.name as userName, l.sapid as sapAccountId,
    l.name as sapAccountName, r.id as roleId, r.name as roleName, r.lob as lob`;
    expect(result).toEqual(expected);
  });

  it('addUserRoleByIdQuery returns the correct query', () => {
    const user = { federationId: '1234' };
    const role = { roleId: 'glb:seed:sm', sapId: '4321', sourceSystem: 'sap-customer-number' };

    const result = addUserRoleByIdQuery(user, role);
    const expected = `
  MATCH(r:Role {id: "${role.roleId}"}),
  (u:User {federationId: "${user.federationId}"})
  MATCH (l:Location {sapid: "${role.sapId}", sourceSystem: "sap-customer-number"})
  MERGE (u)-[:HAS_ROLE {id: r.id}]->(l)`;

    expect(result).toEqual(expected);
  });

  it('addUserRoleQuery returns the correct query and variable', () => {
    const federationId = '1234-5678-9876';
    const sapAccountId = '123456';
    const locationName = 'Farmington Dealers';
    const streetAddress = '1234 This Lane';
    const city = 'Farmington';
    const state = 'MO';
    const zipCode = '65432';
    const hqSapId = '1022461';
    const lob = 'cp';
    const roleName = 'Admin';
    const payer = false;

    const info = {
      userId: 'jsmith@gmail.com',
      userName: 'John Smith',
      roleId: 'glb:*:dealer',
      sapAccountId: '123456',
      brand: 'NB',
      persona: 'dealer',
      locationName: 'Farmington Dealers',
      streetAddress: '1234 This Lane',
      city: 'Farmington',
      state: 'MO',
      zipCode: '65432',
      hqSapId: '1022461',
      federationId: '1234-5678-9876',
      roleName: 'Admin',
      payer: false,
    };

    const result = addUserRoleQuery(info, 'cp');
    const expected = `
    MATCH(r:Role {name: "${roleName}", lob: "${lob}"}),
    (u:User {federationId: "${federationId}"})
    MATCH (l:Location {sapid: "${sapAccountId}", sourceSystem: "sap-customer-number"})
    MERGE (u)-[:HAS_ROLE {id: r.id}]->(l)`;
    expect(result).toEqual(expected);
  });

  it('deleteUserRoleQuery returns the correct query and variable', () => {
    const federationId = '1234-5678-9876';
    const roleName = 'Finance Manager';
    const lob = 'cp';
    const sapAccountId = '123456';

    const body = {
      federationId: '1234-5678-9876',
      roleName: 'Finance Manager',
      sapAccountId: '123456',
    };

    const result = deleteUserRoleQuery(body, 'cp');

    const expected = `
    MATCH (r:Role {name: "${roleName}", lob: "${lob}"}),
    (:User {federationId: "${federationId}"})-[k:HAS_ROLE{id: r.id}]-(:Location {sapid:"${sapAccountId}", sourceSystem: "sap-customer-number"})
    DELETE k`;
    expect(result).toEqual(expected);
  });

  it('editUserRoleQuery returns the correct query', () => {
    const OLD_ROLE = {
      roleName: 'Finance Manager',
      lob: 'cp',
      locationId: '123456',
    };
    const NEW_ROLE = {
      roleName: 'System Admin',
      lob: 'acceleron',
      locationId: '654312',
    };
    const INFO = {
      userId: 'jsmith@gmail.com',
      userName: 'John Smith',
      roleId: 'glb:*:dealer',
      sapAccountId: '123456',
      brand: 'NB',
      persona: 'dealer',
      locationName: 'Farmington Dealers',
      streetAddress: '1234 This Lane',
      city: 'Farmington',
      state: 'MO',
      zipCode: '65432',
      hqSapId: '1022461',
      federationId: '1234-5678-9876',
      roleName: 'Admin',
      payer: false,
    };

    const result = editUserRoleQuery({ info: INFO, oldRole: OLD_ROLE, newRole: NEW_ROLE });
    const expected = `
    MATCH (or:Role {name: "${OLD_ROLE.roleName}", lob: "${OLD_ROLE.lob}"}),
    (u:User {federationId: "${INFO.federationId}"})-[k:HAS_ROLE{id: or.id}]-(:Location {sapid:"${OLD_ROLE.locationId}", sourceSystem: "sap-customer-number"})
    DELETE k
    WITH u MATCH(nr:Role {name: "${NEW_ROLE.roleName}", lob: "${NEW_ROLE.lob}"})
    MATCH (l:Location {sapid: "${NEW_ROLE.locationId}", sourceSystem: "sap-customer-number"})
    MERGE (u)-[:HAS_ROLE {id: nr.id}]->(l)`;
    expect(result).toEqual(expected);
  });

  it('getUsersLocationHierarchyQuery returns the correct query with multiple roles', () => {
    const federationId = '1234-5678-9876';
    const roleIdArray = ['glb:seed:om', 'glb:ch:om'];
    const result = getUserAdminLocationsQuery('1234-5678-9876', ['glb:seed:om', 'glb:ch:om']);
    const expected = `
    MATCH (u:User {federationId: "${federationId}"})-[e:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id: e.id})
    WHERE e.id IN ${rolesConditional(roleIdArray)}]
    RETURN u.id as userId, u.name as userName, l.sapid as sapAccountId, r.lob as lob`;
    expect(result).toEqual(expected);
  });

  it('getUserAdminLocationsQuery returns the correct query with one role', () => {
    const federationId = '1234-5678-9876';
    const result = getUserAdminLocationsQuery('1234-5678-9876', ['glb:seed:om']);
    const expected = `
    MATCH (u:User {federationId: "${federationId}"})-[e:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id: e.id})
    WHERE e.id IN ["glb:seed:om"]
    RETURN u.id as userId, u.name as userName, l.sapid as sapAccountId, r.lob as lob`;
    expect(result).toEqual(expected);
  });

  it(' returns the correct query with no roles', () => {
    const federationId = '1234-5678-9876';
    const result = getUserAdminLocationsQuery('1234-5678-9876', []);
    const expected = `
    MATCH (u:User {federationId: "${federationId}"})-[e:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id: e.id})
    WHERE e.id IN []
    RETURN u.id as userId, u.name as userName, l.sapid as sapAccountId, r.lob as lob`;
    expect(result).toEqual(expected);
  });

  it('getHqSapIdQuery returns the correct query', () => {
    const federationId = '1234-5678-9876';

    const result = getHqSapIdQuery('1234-5678-9876');
    const expected = `
    MATCH (u:User {federationId: "${federationId}"})
    RETURN u.hqSapId as hqSapId`;
    expect(result).toEqual(expected);
  });

  it('getUserApplicationEntitlementsQuery returns the correct query', () => {
    const application = 'user-admin';
    const federationId = '1234-5678-9876';
    const result = getUserApplicationEntitlementsQuery('1234-5678-9876', 'user-admin');
    const expected = `MATCH (u:User {federationId: "${federationId}"})-[hr:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id: hr.id}) -[hp:HAS_PERMISSION]-> (p:Permission {application: "${application}"})
    WHERE NOT EXISTS(hp.featureset)
    OR (l) -[:HAS_FEATURE_SET {country:r.country, brand:r.brand, persona:r.persona, lob: r.lob}]-> (:FeatureSet {name: hp.featureset})
    RETURN u.id as userId, l.sapid as sapAccountId, hp.type as permissionType, p.action as action, p.id as pid`;
    expect(result).toEqual(expected);
  });

  it('getUserProfileQueryByFederationId returns the correct query', () => {
    const federationId = '1234-5678-9876';
    const result = getUserProfileQueryByFedId('1234-5678-9876');
    const expected = `
    MATCH (u:User {federationId: "${federationId}"})-[hr:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id:hr.id})
    RETURN u.id as userId, u.first_name as firstName, u.last_name as lastName,
        u.primary_phone as primaryPhone, u.secondary_phone as secondaryPhone,
        u.address_line_1 as address1, u.address_line_2 as address2,
        u.city as city, u.state as state, u.zipCode as zip,
        collect(distinct l.sapid) as sapAccountIds,
        collect(r) as roles`;
    expect(result).toEqual(expected);
  });

  it('getUserProfileQueryByUserId returns the correct query', () => {
    const userId = 'applesauce@gmail.com';
    const brand = 'national';
    const persona = 'dealer';
    const result = getUserProfileQueryByUserId('applesauce@gmail.com', 'national', 'dealer');
    const expected = `
    MATCH (u:User {id: "${userId}", brand: "${brand}", persona: "${persona}"})-[hr:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id:hr.id})
    RETURN u.id as userId, u.first_name as firstName, u.last_name as lastName,
        u.primary_phone as primaryPhone, u.secondary_phone as secondaryPhone,
        u.address_line_1 as address1, u.address_line_2 as address2,
        u.city as city, u.state as state, u.zipCode as zip,
        collect(distinct l.sapid) as sapAccountIds,
        collect(r) as roles`;
    expect(result).toEqual(expected);
  });

  it('getOptionalParamsList should return stringified JSON with null values removed and only quotes on values', () => {
    const result = getOptionalParamsList({ first_name: 'Apple', last_name: 'Sauce', email: undefined });
    const expected = '{first_name:"Apple",last_name:"Sauce"}';

    expect(result).toEqual(expected);
  });

  it('getContainsParamConditional should return conditional statement if value is specified', () => {
    const result = translators.contains('Apple', 'u', 'first_name');
    const expected = 'WHERE toLower(u.first_name) CONTAINS toLower("Apple")';

    expect(result).toEqual(expected);
  });

  it('getContainsParamConditional should return empty string if value is unspecified', () => {
    const result = translators.contains(undefined, 'u', 'first_name');
    const expected = '';

    expect(result).toEqual(expected);
  });

  it('deleteUserQuery returns the correct query', () => {
    const federationId = '1234-5678-9876';
    const result = deleteUserQuery(federationId);
    const expected = `
    MATCH (u:User {federationId: "1234-5678-9876"})-[k:HAS_ROLE]->(l:Location)
    DELETE k, u
`;
    expect(result).toEqual(expected);
  });

  it('getUserInfoQuery returns the correct query', () => {
    const federationId = '123456789';
    const result = getUserInfoQuery(federationId);
    const expected = `
   MATCH (u:User {federationId: "123456789"})
    OPTIONAL MATCH (u)-[hr:HAS_ROLE]->(l:Location)
    OPTIONAL MATCH (r:Role {id: hr.id})
    RETURN u as user, r as role, l as location`;

    expect(result).toEqual(expected);
  });

  it('updateLocationInfoQuery return the correct query', () => {
    const replaceWhitespace = (str) => str.replace(/\s+/g, ' ').trim();
    const SAP_ID = '0003475537';
    const INFO = {
      name: 'TEST NAME',
      address: 'TEST ADDRESS',
    }
    const FEATURE_SETS = {
      payer: [ {brand: "national", persona: "grower", lob: "seed", country: "us", portal: "mycrop"}],
      test: [ {brand: "test", persona: "test", lob: "test", country: "test", portal: "test"}],
    }

    const result = updateLocationInfoQuery({sapId: SAP_ID, info: INFO, featureSets: FEATURE_SETS});
    const expected = `
  MATCH (l:Location {sapid: "0003475537"})

  SET l += { name: 'TEST NAME', address: 'TEST ADDRESS' }
  WITH l
  OPTIONAL MATCH (l)-[hfs:HAS_FEATURE_SET]->(:FeatureSet {name: "payer"})
  DELETE hfs
  WITH l
  MATCH (f:FeatureSet { name: "payer"})
  MERGE (l)-[:HAS_FEATURE_SET { brand: "national", persona: "grower", lob: "seed", country: "us", portal: "mycrop"}]->(f)
WITH l
  MATCH (f:FeatureSet { name: "test"})
  MERGE (l)-[:HAS_FEATURE_SET { brand: "test", persona: "test", lob: "test", country: "test", portal: "test"}]->(f)
  RETURN l;`
    expect(replaceWhitespace(result)).toEqual(replaceWhitespace(expected));
  });

  it('updateLocationInfoQuery with offset return the correct query', () => {
    const replaceWhitespace = (str) => str.replace(/\s+/g, ' ').trim();
    const SAP_ID = '0003475537';
    const INFO = {
      name: 'TEST NAME',
      address: 'TEST ADDRESS',
      offset: 43
    }
    const FEATURE_SETS = {
      payer: [ {brand: "national", persona: "grower", lob: "seed", country: "us", portal: "mycrop"}],
      test: [ {brand: "test", persona: "test", lob: "test", country: "test", portal: "test"}],
    }

    const result = updateLocationInfoQuery({sapId: SAP_ID, info: INFO, featureSets: FEATURE_SETS});
    const expected = `
  MATCH (l:Location {sapid: "0003475537"})
  where l.offset < 43
  SET l += { name: 'TEST NAME', address: 'TEST ADDRESS', offset: 43 }
  WITH l
  OPTIONAL MATCH (l)-[hfs:HAS_FEATURE_SET]->(:FeatureSet {name: "payer"})
  DELETE hfs
  WITH l
  MATCH (f:FeatureSet { name: "payer"})
  MERGE (l)-[:HAS_FEATURE_SET { brand: "national", persona: "grower", lob: "seed", country: "us", portal: "mycrop"}]->(f)
WITH l
  MATCH (f:FeatureSet { name: "test"})
  MERGE (l)-[:HAS_FEATURE_SET { brand: "test", persona: "test", lob: "test", country: "test", portal: "test"}]->(f)
  RETURN l;`
    expect(replaceWhitespace(result)).toEqual(replaceWhitespace(expected));
  });
});