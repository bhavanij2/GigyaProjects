
import * as queries from '@/server/v1/rest/groups/queries';

describe('role queries', () => {
  describe('getPermissionsQuery', () => {
    it('returns correct query', () => {
      const groups = [
        { id: 'C7-INTERNAL-USER-ADMIN-US-CH-DEALER-SEED-RO' },
        { id: 'C7-INTERNAL-USER-ADMIN-US-CH-DEALER-SEED-W' },
      ];

      const expected = `
            MATCH (p:Permission) <-[hp:HAS_PERMISSION]- (r:Role)
            WHERE r.name = "C7-INTERNAL-USER-ADMIN-US-CH-DEALER-SEED-RO"
          OR r.name = "C7-INTERNAL-USER-ADMIN-US-CH-DEALER-SEED-W"
            RETURN r.name as id, r.brand as brand, r.country as country,r.persona as persona, hp.type as access, collect(p.id) as permissions`;

      const actual = queries.getPermissionsQuery(groups);
      expect(actual.replace(/\s/gm, '')).toBe(expected.replace(/\s/gm, ''));
    });
  });
});
