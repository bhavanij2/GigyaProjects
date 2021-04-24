import { createPermissionService } from '../services'

async function createPermission(body) {
  return await createPermissionService(body);
}

export default createPermission;