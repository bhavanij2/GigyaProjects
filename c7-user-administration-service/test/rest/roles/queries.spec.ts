import * as queries from '@/server/v1/rest/roles/queries';
import { AddRoleRequestBody, PartialRole } from '@/server/v1/rest/roles/types';
import { Brand, Persona } from '@/server/v1/rest/users/types';


describe('role queries', () => {
  describe('AddRoleQuery', () => {
    it('returns correct query', () => {
      const addRoleRequestBody: AddRoleRequestBody = {
        id: 'glb:seed:test-role',
        name: 'test',
        lob: 'seed',
        brand: Brand.Channel,
        persona: Persona.Dealer,
        country: 'usa',
        scope: 'global',
        description: 'test description',
        longDescription: 'test long description',
        beta: true,
        internal: false,
      };

      const expected = `
    CREATE (r:Role { id: "glb:seed:test-role", name: "test", lob: "seed",
        brand: "channel", persona: "dealer", country: "usa",
        description: "test description", longDescription: "test long description", scope: "global",
        beta: true, internal: false})`;

      const actual = queries.addRoleQuery(addRoleRequestBody);
      expect(actual).toBe(expected);
    });
  });

  describe('DeleteRoleQuery', () => {
    it('returns correct query', () => {
      const roleId = 'glb:seed:test-role';

      const expected = `
    MATCH (r:Role { id: 'glb:seed:test-role'}) detach delete r`;

      const actual = queries.deleteRoleQuery(roleId);
      expect(actual).toBe(expected);
    });
  });

  describe('Update Role queires', () => {
    it('Duplicate user role query', () => {
      const oldRoleId = 'glb:seed:test-role';
      const role: PartialRole = {
        newRoleId: 'glb:seed:test-new-role',
      };

      const expected = "match(u:User)-[:HAS_ROLE{id: 'glb:seed:test-role'}]-(l:Location) create (u)-[:HAS_ROLE{id: 'glb:seed:test-new-role'}]->(l)";

      const actual = queries.duplicateUserRoleQuery({ oldRoleId, role });
      expect(actual).toBe(expected);
    });

    it('Duplicate role to permission query', () => {
      const oldRoleId = 'glb:seed:test-role';
      const role: PartialRole = {
        newRoleId: 'glb:seed:test-new-role',
      };

      const expected = `match(r:Role{id: 'glb:seed:test-role'})-[hr:HAS_PERMISSION]-(p:Permission),
    (newRole:Role{id: 'glb:seed:test-new-role'})
    create (newRole)-[:HAS_PERMISSION {type:hr.type}]->(p)`;

      const actual = queries.duplicateRolePermissionQuery({ oldRoleId, role });
      expect(actual).toBe(expected);
    });

    it('Update role attributes', () => {
      const roleId = 'glb:seed:test-role';
      const role: PartialRole = {
        longDescription: 'test long description',
      };

      const expected = `
        match (r:Role { id: 'glb:seed:test-role'})
        set r += { longDescription: 'test long description' }
        return r;`;

      const actual = queries.updatePartialRoleQuery({ roleId, role });
      expect(actual).toBe(expected);
    });
  });
});
