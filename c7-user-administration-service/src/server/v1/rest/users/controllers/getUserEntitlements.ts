import { getUserEntitlements as getUserEntitlementsService } from '../users.persistence';
import { UserEntitlementsResponse } from '../types';

async function getUserEntitlements(federationId: string): Promise<UserEntitlementsResponse> {
  return getUserEntitlementsService(federationId);
}

export default getUserEntitlements;
