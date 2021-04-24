import { deleteRolesServices } from '../services'

async function deleteRole(
  roleId: string,
  userProfile: any,
) {
  return deleteRolesServices(roleId, userProfile);
}

export default deleteRole;
