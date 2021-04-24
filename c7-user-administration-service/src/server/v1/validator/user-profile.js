import { getUserProfile } from '../permissions.util';

export async function validate(userProfile) {
  const userProfileObj = getUserProfile(userProfile);
  if (!userProfileObj) {
    return Promise.reject(new Error('user-profile required'));
  }
  if (!userProfileObj.federationId) {
    return Promise.reject(new Error('federationId required'));
  }
  if (!userProfileObj.firstName) {
    return Promise.reject(new Error('firstName required'));
  }
  if (!userProfileObj.lastName) {
    return Promise.reject(new Error('lastName required'));
  }
  if (!userProfileObj.email) {
    return Promise.reject(new Error('email required'));
  }
  return Promise.resolve(true);
}
