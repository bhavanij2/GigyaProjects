import { CreatePermissionBody } from "./types";

export const createPermissionQuery = (body: CreatePermissionBody) => `
    CREATE (p:Permission { id: '${body.id}', action: '${body.action}', lob: '${body.lob}',
        type: '${body.type}', description: '${body.description}',
        application: '${body.application}'})`;

export const deletePermissionQuery = (id: string) => `
    MATCH (p:Permission { id: '${id}' })
        DETACH DELETE p`;
