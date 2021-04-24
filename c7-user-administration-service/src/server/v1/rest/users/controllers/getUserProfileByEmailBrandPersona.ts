import { getProfileByUserIdService } from '../users.persistence';
import { Brand, Persona, GetUserProfileResponse } from '../types';

async function getUserProfileByEmailBrandPersona(
  email: string,
  brand: Brand,
  persona: Persona,
): Promise<GetUserProfileResponse> {
  return getProfileByUserIdService(email, brand, persona);
}

export default getUserProfileByEmailBrandPersona;
