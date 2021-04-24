import { AddRoleRequestBody } from '../types';
import { addRolesServices } from '../services';

async function addRole(
  addRoleRequestBody: AddRoleRequestBody,
  userProfile: any,
) {
  return addRolesServices(addRoleRequestBody, userProfile);
}

export default addRole;
