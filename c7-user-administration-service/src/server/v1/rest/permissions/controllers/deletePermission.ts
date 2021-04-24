import { deletePermissionService } from '../services'

async function deletePermission(id) {
  return await deletePermissionService(id);
}

export default deletePermission;