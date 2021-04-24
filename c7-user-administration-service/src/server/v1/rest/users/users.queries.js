import { conditionalStringsFrom } from '../utils';

const util = require('util');

export const getUserInfoQuery = federationId => `
   MATCH (u:User {federationId: "${federationId}"})
    OPTIONAL MATCH (u)-[hr:HAS_ROLE]->(l:Location)
    OPTIONAL MATCH (r:Role {id: hr.id})
    RETURN u as user, r as role, l as location`;

export const getOptionalParamsList = params => {
  const list = Object.keys(params).reduce((a, k) => {
    if (params[k] && params[k] !== '') {
      a[k] = params[k];
    }
    return a;
  }, {});
  return JSON.stringify(list).replace(/"([^(")"]+)":/g, '$1:');
};

export const getUsersFromHqSearchQuery = (hqSapId, conditionals, sapId) => {
  const [conditionalStrings, AND] = conditionalStringsFrom(conditionals, false, 'u');

  return `
    MATCH (u:User {hqSapId: "${hqSapId}"})-[hr:HAS_ROLE]->(l:Location ${getOptionalParamsList({ sapid: sapId })})
    ${conditionalStrings.first_name || ''}
    ${conditionalStrings.last_name || ''}
    ${conditionalStrings.id || ''}
    ${conditionalStrings.city || ''}
    ${conditionalStrings.state || ''}
    ${conditionalStrings.location || ''}
    ${AND ? 'AND' : 'WHERE'}
    ( u.testUser <> "yes" OR NOT EXISTS (u.testUser))
    RETURN collect(distinct u) as user;`;
};

export const getUserRolesQuery = federationId => `
    MATCH (u:User {federationId: "${federationId}"})-[assignment:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id: assignment.id})
    RETURN u.id as userId, u.name as userName, l.sapid as sapAccountId,
    l.name as sapAccountName, r.id as roleId, r.name as roleName, r.lob as lob`;

export const getUserApplicationEntitlementsQuery = (federationId, application) => `MATCH (u:User {federationId: "${federationId}"})-[hr:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id: hr.id}) -[hp:HAS_PERMISSION]-> (p:Permission {application: "${application}"})
    WHERE NOT EXISTS(hp.featureSet)
    OR (l) -[:HAS_FEATURE_SET {country:r.country, brand:r.brand, persona:r.persona, lob: r.lob}]-> (:FeatureSet {name: hp.featureSet})
    RETURN u.id as userId, l.sapid as sapAccountId, hp.type as permissionType, p.action as action, p.id as pid`;


function getScopeStrings(scopes) {
  return scopes.map(scope => `\t(r.brand = "${scope.brand}" AND r.persona = "${scope.persona}" AND r.country = "${scope.country}" AND r.lob = "${scope.lob}")`);
}

function filterScopes(scopes) {
  if (!scopes || scopes.length === 0) return '';
  return `AND (
      ${getScopeStrings(scopes).join(' OR\n')}
    )`;
}

export const getUserEntitlementsQuery = (federationId, scopes) => `MATCH (u:User {federationId: "${federationId}"})-[hr:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id: hr.id}) -[hp:HAS_PERMISSION]-> (p:Permission)
    WHERE (NOT EXISTS(hp.featureSet)
    OR (l) -[:HAS_FEATURE_SET {country:r.country, brand:r.brand, persona:r.persona, lob: r.lob}]-> (:FeatureSet {name: hp.featureSet}))
    ${filterScopes(scopes)}
    RETURN u.id as userId, l.sapid as sapAccountId, hp.type as permissionType, p.action as action, p.id as pid`;

export const getUserEntitlementsUserProfileQuery = (userId, brand, persona) => `MATCH (u:User {id: "${userId}", brand: "${brand}", persona: "${persona}"})-[hr:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id: hr.id}) -[hp:HAS_PERMISSION]-> (p:Permission)
    WHERE NOT EXISTS(hp.featureSet)
    OR (l) -[:HAS_FEATURE_SET {country:r.country, brand:r.brand, persona:r.persona, lob: r.lob}]-> (:FeatureSet {name: hp.featureSet})
    RETURN u.id as userId, l.sapid as sapAccountId, hp.type as permissionType, p.action as action, p.id as pid`;

export const getHqSapIdQuery = federationId => `
    MATCH (u:User {federationId: "${federationId}"})
    RETURN u.hqSapId as hqSapId`;

export const getUserProfileQueryByUserId = (userId, brand, persona) => `
    MATCH (u:User {id: "${userId}", brand: "${brand}", persona: "${persona}"})-[hr:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id:hr.id})
    RETURN u.id as userId, u.first_name as firstName, u.last_name as lastName,
        u.primary_phone as primaryPhone, u.secondary_phone as secondaryPhone,
        u.address_line_1 as address1, u.address_line_2 as address2,
        u.city as city, u.state as state, u.zipCode as zip,
        collect(distinct l.sapid) as sapAccountIds,
        collect(r) as roles`;

export const getUserProfileQueryByFedId = federationId => `
    MATCH (u:User {federationId: "${federationId}"})-[hr:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id:hr.id})
    RETURN u.id as userId, u.first_name as firstName, u.last_name as lastName,
        u.primary_phone as primaryPhone, u.secondary_phone as secondaryPhone,
        u.address_line_1 as address1, u.address_line_2 as address2,
        u.city as city, u.state as state, u.zipCode as zip,
        collect(distinct l.sapid) as sapAccountIds,
        collect(r) as roles`;

function filterScopesWithAWhere(scopes) {
  if (!scopes || scopes.length === 0) return '';
  return `WHERE (
      ${getScopeStrings(scopes).join(' OR\n')}
    )`;
}

export const getUserAccountsQuery = (federationId, scopes) => `
    MATCH (u:User {federationId: "${federationId}"})-[hr:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id: hr.id})
    ${filterScopesWithAWhere(scopes)}
    RETURN u.id as userId, u.name as userName, u.federationId as uid, u.persona as persona, u.brand as brand,
    u.contact_glopid as contactGlopid, l.sapid as sapAccountId, l.city as city, l.state as state, l.name as accountName,
    l.sourceSystem as sourceSystem, u.contactSfdcId as contactSfdcId, u.first_name as firstName, u.last_name as lastName, u.primary_phone as primaryPhone,
    u.secondary_phone as secondaryPhone, u.primary_phone_type as primaryPhoneType, u.secondary_phone_type as secondaryPhoneType,
    u.address_line_1 as addressLine1, u.address_line_2 as addressLine2, u.city as userCity, u.state as userState, u.zipCode as zipCode`;

export const getUserAccountsQueryByUseridQuery = (userId, brand, persona) => `
    MATCH (u:User {id: "${userId}", brand: "${brand}", persona: "${persona}"})-[assignment:HAS_ROLE]->(l:Location)
    RETURN u.id as userId, u.name as userName, u.federationId as uid, u.persona as persona, u.brand as brand,
    u.contact_glopid as contactGlopid, u.first_name as firstName, u.last_name as lastName,
    l.sapid as sapAccountId, l.city as city, l.state as state, l.name as accountName, l.sourceSystem as sourceSystem, u.primary_phone as primaryPhone,
    u.secondary_phone as secondaryPhone, u.primary_phone_type as primaryPhoneType, u.secondary_phone_type as secondaryPhoneType,
    u.address_line_1 as addressLine1, u.address_line_2 as addressLine2, u.city as userCity, u.state as userState, u.zipCode as zipCode
`;

export const addUserRoleByIdQuery = (user, { roleId, sapId, sourceSystem = 'sap-customer-number' }) => `
  MATCH(r:Role {id: "${roleId}"}),
  (u:User {federationId: "${user.federationId}"})
  MATCH (l:Location {sapid: "${sapId}", sourceSystem: "${sourceSystem}"})
  MERGE (u)-[:HAS_ROLE {id: r.id}]->(l)`;

export const addUserRoleQuery = (info, lob, sourceSystem = info.sourceSystem || 'sap-customer-number') => `
    MATCH(r:Role {name: "${info.roleName}", lob: "${lob}"}),
    (u:User {federationId: "${info.federationId}"})
    MATCH (l:Location {sapid: "${info.sapAccountId}", sourceSystem: "${sourceSystem}"})
    MERGE (u)-[:HAS_ROLE {id: r.id}]->(l)`;

export const deleteUserRoleQuery = (body, lob, sourceSystem = body.sourceSystem || 'sap-customer-number') => `
    MATCH (r:Role {name: "${body.roleName}", lob: "${lob}"}),
    (:User {federationId: "${body.federationId}"})-[k:HAS_ROLE{id: r.id}]-(:Location {sapid:"${body.sapAccountId}", sourceSystem: "${sourceSystem}"})
    DELETE k`;

export const editUserRoleQuery = ({ info, oldRole, newRole, oldSourceSystem = oldRole.sourceSystem || 'sap-customer-number', newSourceSystem = newRole.sourceSystem || 'sap-customer-number' }) => `
    MATCH (or:Role {name: "${oldRole.roleName}", lob: "${oldRole.lob}"}),
    (u:User {federationId: "${info.federationId}"})-[k:HAS_ROLE{id: or.id}]-(:Location {sapid:"${oldRole.locationId}", sourceSystem: "${oldSourceSystem}"})
    DELETE k
    WITH u MATCH(nr:Role {name: "${newRole.roleName}", lob: "${newRole.lob}"})
    MATCH (l:Location {sapid: "${newRole.locationId}", sourceSystem: "${newSourceSystem}"})
    MERGE (u)-[:HAS_ROLE {id: nr.id}]->(l)`;

export const createUserQuery = ({ user, hqSapId }) => `
  MERGE (u:User {id: "${user.id}", name: "${user.name}", hqSapId: "${hqSapId}",
  federationId: "${user.federationId}", brand: "${user.brand}", persona: "${user.persona}",
  first_name: "${user.first_name}", last_name: "${user.last_name}", address_line_1: "${user.address_line_1}",
  address_line_2: "${user.address_line_2}", city: "${user.city}", state: "${user.state}", country: "${user.country}",
  primary_phone: "${user.primary_phone}", primary_phone_type: "${user.primary_phone_type}",
  secondary_phone: "${user.secondary_phone}", secondary_phone_type: "${user.secondary_phone_type}",
  contact_glopid: "${user.contact_glopid}", zipCode: "${user.zipCode}", status: "active",
  testUser: "${user.testUser || 'no'}"})
  RETURN u`;

export const updateUserDataQuery = body => {
  const updateParams = util.inspect(body.properties);
  return `
    MATCH (u:User {id: "${body.userId}", brand: "${body.brand}", persona: "${body.persona}"})
    SET u += ${updateParams}
    RETURN u`;
};

export default {
  addUserRoleQuery,
  deleteUserRoleQuery,
  editUserRoleQuery,
  getOptionalParamsList,
  getUserInfoQuery,
  getUserRolesQuery,
  getUserApplicationEntitlementsQuery,
  getUserEntitlementsQuery,
  getUserEntitlementsUserProfileQuery,
  getHqSapIdQuery,
  getUserProfileQueryByUserId,
  getUserProfileQueryByFedId,
  getUserAccountsQuery,
  getUserAccountsQueryByUseridQuery,
};
