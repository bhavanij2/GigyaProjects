
import to from 'await-to-js';

import { EntitlementsTree, ExternalUserProfile } from './security.types';
import { getFederationId } from '../v1/persistence/shadow'
import { fetchEntitlements } from '../v1/persistence/entitlement';
import { VelocityPermissions } from '../v1/rest/groups/types';

/*
 * can fix linting error on this line by changing libs 
 * in tsconfig to include 'es2019'
 */
// @ts-ignore-line
const flattenExternalPermissions = (permissions: EntitlementsTree): string[] => Object.values(permissions).flat();
const flattenInternalPermissions = (permissions: VelocityPermissions): string[] => {
  const flattenedPermissions = [];
  for (const country in permissions) {
    const brands = permissions[country];
    for (const brand in brands) {
      const personas = brands[brand];
      for (const persona in personas) {
        const flattenedPermissions = personas[persona];
        for(const p of flattenedPermissions) {
          flattenedPermissions.push(p);
        }
      }
    }
  }
  return flattenedPermissions;
}

const checkExternalAuthorization = (permissions: EntitlementsTree, scopes: string[]): boolean => {
  const flattenedPermissions = flattenExternalPermissions(permissions);
  return scopes.every(scope => {
    const reg = new RegExp(scope.replace(/[\$, \*]/g, `\\w*`));
    return flattenedPermissions.some(e => e.match(reg));
  });
};

const checkInternalAuthorization = (permissions: VelocityPermissions, scopes: string[]) => boolean => {
  const flattenedPermissions = flattenInternalPermissions(permissions);
  return scopes.every(scope => {
    const reg = new RegExp(scope.replace(/[\$, \*]/g, `\\w*`));
    return flattenedPermissions.some(e => e.match(reg));
  });
};

const getExternalPermissions = async (userProfile: ExternalUserProfile): Promise<EntitlementsTree> => {
  const [errorGettingFederationId, user] = await to(getFederationId(userProfile.federationId));
  if (errorGettingFederationId) {
    return Promise.reject(errorGettingFederationId);
  }

  const [errorFetchingEntitlements, response] = await to(fetchEntitlements(user));
  if (errorFetchingEntitlements) { 
    return Promise.reject(errorFetchingEntitlements);
  }
  return Promise.resolve(response.entitlements);
};

export {
  checkExternalAuthorization,
  checkInternalAuthorization,
  getExternalPermissions,
};
