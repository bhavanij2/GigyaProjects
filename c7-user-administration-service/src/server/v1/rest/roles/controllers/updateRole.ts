import { PartialRole } from '../types';
import { updatePartialRole as updatePartialRoleService} from '../services'

async function updatePartialRole(
  oldId: string,
  role: PartialRole,
) {
  return updatePartialRoleService(oldId, role);
}

export default updatePartialRole;