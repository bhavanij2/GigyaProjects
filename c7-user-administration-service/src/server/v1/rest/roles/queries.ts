import { AddRoleRequestBody } from './types';
import { ROLE_FIELD_TYPES } from './utils';
import { conditionalStringsFrom, removeEmptyValues } from '../utils';

const util = require('util');

export const addRoleQuery = (roleBody: AddRoleRequestBody) => `
    CREATE (r:Role { id: "${roleBody.id}", name: "${roleBody.name}", lob: "${roleBody.lob}",
        brand: "${roleBody.brand}", persona: "${roleBody.persona}", country: "${roleBody.country}",
        description: "${roleBody.description}", longDescription: "${roleBody.longDescription}", scope: "${roleBody.scope}",
        beta: ${roleBody.beta}, internal: ${roleBody.internal}})`;

export const deleteRoleQuery = (roleId: string) => `
    MATCH (r:Role { id: '${roleId}'}) detach delete r`;

export const deleteUserRoleRelationshipQuery = (roleId: string) => `
    MATCH (:User)-[hr:HAS_ROLE { id:'${roleId}'}]->(:Location) delete hr`;

export const getRolesQuery = params => {
  const [conditionalStrings, AND] = conditionalStringsFrom(params, false, 'r', ROLE_FIELD_TYPES);
  return `MATCH(r: Role)
            ${Object.keys(conditionalStrings).map(k => conditionalStrings[k]).join('\n\t')}
            OPTIONAL MATCH(r:Role)-[hp:HAS_PERMISSION]->(p:Permission)
            return r.id as roleId, r.name as roleName, r.lob as lob,
            r.brand as brand, r.persona as persona, r.country as country,
            r.description as description, r.scope as scope, r.beta as beta,
            p.action as action, hp.type as access, hp.featureSet as featureSet, p.id as permissionId`;
};

export const duplicateUserRoleQuery = ({ oldRoleId, role }) => `match(u:User)-[:HAS_ROLE{id: '${oldRoleId}'}]-(l:Location) create (u)-[:HAS_ROLE{id: '${role.newRoleId}'}]->(l)`;

export const duplicateRolePermissionQuery = ({ oldRoleId, role }) => `match(r:Role{id: '${oldRoleId}'})-[hr:HAS_PERMISSION]-(p:Permission),
    (newRole:Role{id: '${role.newRoleId}'})
    create (newRole)-[:HAS_PERMISSION {type:hr.type}]->(p)`;

export const updatePartialRoleQuery = ({ roleId, role }) => {
  const roleInfo = removeEmptyValues(role);
  return `
        match (r:Role { id: '${roleId}'})
        set r += ${util.inspect(roleInfo)}
        return r;`;
};
