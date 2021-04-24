import * as queries from '@/server/v1/rest/permissions/queries';
import {LOB, PermissionType} from '@/server/v1/rest/permissions/types';

describe.only('PermissionQueries', () => {
  describe('createPermissionQuery', () => {
    it('returns the correct query', () => {
      const result = queries.createPermissionQuery({
        id: 'seed:test:test-p',
        lob: LOB.Licensee,
        action: 'test',
        application: 'test',
        type: PermissionType.widget,
        description: 'Test Description',
      });
      expect(result).toBe(`
    CREATE (p:Permission { id: 'seed:test:test-p', action: 'test', lob: 'lic',
        type: 'widget', description: 'Test Description',
        application: 'test'})`);
    });
  })

  describe('deletePermissionQuery', () => {
    it('returns the correct query', () => {
      const result = queries.deletePermissionQuery('TEST_ID');
      expect(result).toBe(`
    MATCH (p:Permission { id: 'TEST_ID' })
        DETACH DELETE p`);
    });
  })
});
