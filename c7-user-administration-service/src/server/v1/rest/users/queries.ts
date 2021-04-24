import { User } from "./types";
import { conditionalStringsFrom } from "../utils";

export const getUsersQuery = ( conditionals: Partial<User>, sapId?: string) => {
  const [conditionalStrings, AND] = conditionalStringsFrom(conditionals, false, 'user');
  const locationFilter = sapId ? ` -[hr: HAS_ROLE]-> (l: Location { sapid: '${sapId}' }) `: '';
  return `MATCH(user: User) ${locationFilter}
    ${Object.keys(conditionalStrings).map(k => conditionalStrings[k]).join('\n\t')}
    
    RETURN DISTINCT(user)`;
};