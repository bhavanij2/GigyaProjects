import * as queries from '@/server/v1/rest/users/queries';
import { User } from '@/server/v1/rest/users/types';

describe('user queries', () => {
  describe('getUsersQuery', () => {
    it('returns correct query with no conditionals', () => {
      const sapId = '123';
      const conditionals: Partial<User> = {};

      const expected = `MATCH(user: User) - [hr: HAS_ROLE] -> (l: Location { sapid: '${sapId}' }) RETURN DISTINCT(user)`; //eslint-disable-line

      const actual = queries.getUsersQuery(conditionals, sapId);
      expect(actual.replace(/\s/gm, '')).toBe(expected.replace(/\s/gm, ''));
    });

    it('returns correct query with last_name', () => {
      const sapId = '123';
      const conditionals: Partial<User> = {
        last_name: 'W',
      };

      const expected = `MATCH(user:User)-[hr:HAS_ROLE]->(l:Location{sapid:'123'})WHEREtoLower(user.last_name)CONTAINStoLower(\"W\")RETURNDISTINCT(user)`; //eslint-disable-line

      const actual = queries.getUsersQuery(conditionals, sapId);
      expect(actual.replace(/\s/gm, '')).toBe(expected.replace(/\s/gm, ''));
    });

    it('returns correct query with city', () => {
      const sapId = '123';
      const conditionals: Partial<User> = {
        city: 'C',
      };

      const expected = `MATCH(user: User)  -[hr: HAS_ROLE]-> (l: Location { sapid: '123' }) 
    WHERE toLower(user.city) CONTAINS toLower(\"C\")
    
    RETURN DISTINCT(user)`;

      const actual = queries.getUsersQuery(conditionals, sapId);
      expect(actual.replace(/\s/gm, '')).toBe(expected.replace(/\s/gm, ''));
    });

    it('returns correct query with conditionals', () => {
      const sapId = '123';
      const conditionals: Partial<User> = {
        first_name: 'J',
        last_name: 'W',
        city: 'C',
        state: 'S',
      };

      const expected = `MATCH(user: User)  -[hr: HAS_ROLE]-> (l: Location { sapid: '123' }) 
        WHERE toLower(user.first_name) CONTAINS toLower(\"J\")
        AND toLower(user.last_name) CONTAINS toLower(\"W\")
        AND toLower(user.city) CONTAINS toLower(\"C\")
        AND toLower(user.state) CONTAINS toLower(\"S\")
        RETURN DISTINCT(user)`;

      const actual = queries.getUsersQuery(conditionals, sapId);
      expect(actual.replace(/\s/gm, '')).toBe(expected.replace(/\s/gm, ''));
    });
  });
});
