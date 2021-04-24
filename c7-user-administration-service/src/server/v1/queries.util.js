import {
  chain,
} from 'lodash';
import {
  attachFeatureSetClause,
} from './rest/locations/locations.queries';

const util = require('util');

export const getUsersWithRolesByLocationQuery = sapId => `
    MATCH (u:User)-[e:HAS_ROLE]->(l:Location { sapid: "${sapId}" })
    MATCH (r:Role {id: e.id})
    RETURN u.id as userId, u.name as userName, l.sapid as sapAccountId,
    l.name as sapAccountName, r.id as roleId, r.name as roleName, r.lob as lob`;

export const createInternalUser = user => `
  CREATE (n:User { federationId: "${user.federationId}", persona: "${user.userType}", last_name: "${user.lastName}",
  id: "${user.email}", first_name: "${user.firstName}", name: "${user.firstName} ${user.lastName}",
  internal: true})`;

export const deleteUserQuery = federationId => `
    MATCH (u:User {federationId: "${federationId}"})-[k:HAS_ROLE]->(l:Location)
    DELETE k, u
`;

export const getLocationQuery = (sapAccountId, sourceSystem) => `
    MATCH (l:Location)
    WHERE l.sapid = "${sapAccountId}" AND l.sourceSystem = "${sourceSystem}"
    RETURN l as Location;
`;

export const createLocationQuery = location => `
  CREATE (l:Location { sapid: "${location.sapAccountId}", hqSapId: "${location.hqSapId}", name: "${location.locationName}",
  streetAddress: "${location.streetAddress}", city: "${location.city}", state: "${location.state}",
  zipCode: "${location.zipCode}", sourceSystem: "${location.sourceSystem}"})
  ${Object.keys(location.featureSets).map(fs => attachFeatureSetClause(fs, location.featureSets[fs]).join('\n'))}`;

export const rolesConditional = roleIdArray => chain(roleIdArray)
  .reduce(((memo, val, index) => {
    if (index === 0) {
      return `${memo}"${val}"`;
    }
    return `${memo},"${val}"`;
  }), '[');

export const getUserAdminLocationsQuery = (federationId, roleIdArray) => `
    MATCH (u:User {federationId: "${federationId}"})-[e:HAS_ROLE]->(l:Location)
    MATCH (r:Role {id: e.id})
    WHERE e.id IN ${rolesConditional(roleIdArray)}]
    RETURN u.id as userId, u.name as userName, l.sapid as sapAccountId, r.lob as lob`;

const constructPermissionAttributes = (type, featureSet) => {
  if (featureSet !== undefined && featureSet !== null) {
    return `type: "${type}", featureSet: "${featureSet}"`;
  }
  return `type: "${type}"`;
};

export const assignRolesPermissionsQuery = (roleName, permission) =>  `
    MATCH (r:Role {name: "${roleName}", lob: "${permission.lob}"})
    MATCH (p:Permission {id: "${permission.id}"})
    CREATE (r)-[hp:HAS_PERMISSION {${constructPermissionAttributes(permission.type, permission.featureSet)}}]->(p)`;

export const assignTestRolesPermissionsQuery = (roleInfo, permission, featureSet) => `
    MATCH (r:Role {name: "${roleInfo.roleName}", lob: "${roleInfo.roleLob}"})
    MATCH (p:Permission {id: "${permission.id}"})
    CREATE (r)-[hp:HAS_PERMISSION {type: "${permission.type}", featureSet: "${featureSet}]->(p)`;

export const deleteRolesPermissionsQuery = (roleName, permission) => `
    MATCH (r:Role {name: "${roleName}"})-[hp:HAS_PERMISSION {${constructPermissionAttributes(permission.type, permission.featureSet)}}]->(:Permission {
    id: "${permission.id}"})
    DELETE hp`;

export const allPermissions = () => `
    MATCH (p:Permission)
    RETURN p.application as application, p.action as action, p.id as id, p.lob as lob`;

export const allPermissionsByApplication = application => `
    MATCH (p:Permission {application: "${application}"})
    RETURN p.application as application, p.action as action, p.id as id, p.lob as lob`;


export const permissionsByRoleQuery = roleName => `
    MATCH (r:Role {name: "${roleName}"})-[hp:HAS_PERMISSION]->(p:Permission)
    return r.id as roleId, r.name as roleName, p.id as permissionId, hp.type as type, hp.featureSet as featureSet
`;

export const getUser = federationId => `
    MATCH (u:User {federationId: "${federationId}"}) return u as user;`;

export const getUsersFromLocation = sapId => `
MATCH (u:User)-[e:HAS_ROLE]->(l:Location { sapid: "${sapId}" })
MATCH (r:Role {id: e.id})
RETURN u as user`;

export const updateUserDataByFedIdQuery = data => {
  const fedId = data.federationId;
  delete data.federationId;
  const body = util.inspect(data);
  return `
    MATCH (u:User {federationId: "${fedId}"})
    SET u += ${body}
    RETURN u`;
};

export const createShadowRelationshipQuery = (federationIdOfShadower, federationIdOfShadowy) => `
  MATCH (a:User),(b:User)
  WHERE a.federationId = '${federationIdOfShadower}' AND b.federationId = '${federationIdOfShadowy}'
  CREATE (a)-[r:HAS_SHADOW]->(b)
  RETURN type(r)`;

export const deleteShadowRelationshipQuery = federationIdOfShadower => `
  MATCH (u:User {federationId: '${federationIdOfShadower}'})-[r:HAS_SHADOW]-(:User) DELETE r;`;

export const getShadowedUser = federationIdOfShadower => `MATCH  (s:User {federationId: '${federationIdOfShadower}'})-[:HAS_SHADOW]->(u:User) RETURN u.federationId;`;

export const updateBrandQuery = (federationId, brand, persona) => `
  MATCH (u:User {federationId: '${federationId}'})
  SET u += { brand: '${brand}', persona: '${persona}' }
  RETURN u`;
