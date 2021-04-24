import { VelocityGroup } from './types';


const getString = (id: string, or = false): string => `${or ? 'OR' : 'WHERE'} r.name = "${id}"`;

//  TODO: QueryBuilder?
const getGroupStrings = (groups: VelocityGroup[]): string[] => (
  groups.map((g, i) => getString(g.id, i > 0))
);

export const getPermissionsQuery = (groups: VelocityGroup[]) => {
  const groupStrings = getGroupStrings(groups);
  return `
    MATCH (p:Permission) <-[hp:HAS_PERMISSION]- (r:Role)
    ${groupStrings.join('\n\t')}
    RETURN r.name as id, r.brand as brand, r.country as country, r.persona as persona, hp.type as access, collect(p.id) as permissions`;
};
