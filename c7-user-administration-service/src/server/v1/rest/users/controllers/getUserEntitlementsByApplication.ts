import { getUserApplicationEntitlements, } from '../users.persistence';
import { UserEntitlementsResponse } from '../types';

async function getUserEntitlementsByApplication(
  federationId: string,
  application: string,
): Promise<UserEntitlementsResponse> {
  return getUserApplicationEntitlements(federationId, application);
}

export default getUserEntitlementsByApplication;
