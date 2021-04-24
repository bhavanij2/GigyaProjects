import { getUserEntitlementsUserProfileService } from '../users.persistence';
import { UserEntitlementsResponse, Brand, Persona } from '../types';

async function getUserEntitlementsUserProfile(
  userId: string,
  brand: Brand,
  persona: Persona,
): Promise<UserEntitlementsResponse> {
  return getUserEntitlementsUserProfileService(userId, brand, persona);
}

export default getUserEntitlementsUserProfile;
