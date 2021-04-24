import { getAndSendUserInfoToCu360 } from '../../../../utils/cu360.utils';
import { AddUserRoleRequestBody } from '../types';

import { addUserRoleService } from '../users.persistence';
import { getUserProfile } from '../../../permissions.util';

async function addUserRole(
  addUserRoleRequestBody: AddUserRoleRequestBody,
  federationId: string,
  roleName: string,
  locationId: string,
  userProfileHeader?: string,
): Promise<string> {
  const userProfile = getUserProfile(userProfileHeader);
  const result = await addUserRoleService({
    ...addUserRoleRequestBody,
    federationId,
    roleName,
    sapAccountId: locationId,
    adminId: userProfile.federationId || userProfile.email,
  });
  
  try {
    await getAndSendUserInfoToCu360(federationId);
  } catch (e) {
    console.error('Unable to update in customer 360', e);
    // TODO: Handle exception by sending slack alert
  }
  return result.message;
}

export default addUserRole;
