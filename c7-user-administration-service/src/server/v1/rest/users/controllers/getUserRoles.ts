import { getUserRolesService } from '../users.persistence';
import { GetUserRolesResponseObject } from '../types';

async function getUserRoles(federationId: string): Promise<GetUserRolesResponseObject[]> {
  return getUserRolesService(federationId);
}

export default getUserRoles;
