import shiroTrie from 'shiro-trie';
import { to } from 'await-to-js';
import { getUserEntitlementsUserProfile } from './entitlements/index';
import { fetchEntitlements } from './persistence/entitlement';
import { getAndMapPAPIGroups } from './rest/groups/controllers/getPermissions';

const { services } = require('@monsantoit/cloud-foundry');

const entitlement = shiroTrie.newTrie();

// todo: update to federationID when Ocelot makes their change to the userProfile
// todo: update to accomodate internal user profile
export const getUserProfile = userProfile => {
  if (process.env.NODE_ENV !== 'production') {
    const localProfile = {
      id: services['user-profile'].id,
      username: services['user-profile'].username,
      brand: services['user-profile'].brand,
      userType: services['user-profile'].persona,
      federationId: services['user-profile'].federationId,
      firstName: services['user-profile'].firstName,
      lastName: services['user-profile'].lastName,
      country: services['user-profile'].country,
    };
    return localProfile;
  }
  const profile = JSON.parse(userProfile);
  return {
    ...profile,
    federationId: profile.federationId || profile.id
  };
};

/* TODO: reuse? */
export const verifyUserPermission = async (userProfile, sapAccountId, permission) => {
  const { username, brand, userType } = userProfile;
  const userPermissions = await getUserEntitlementsUserProfile(username, brand, userType);
  const permissions = userPermissions[sapAccountId];
  if (permissions === undefined || permissions[0] === undefined) {
    return false;
  }

  entitlement.add(permissions);
  const checkResult = entitlement.permissions(permission);
  if (checkResult.includes('write')) {
    return true;
  }
  return false;
};

/* TODO: reuse? */
export const hasPermission = async (user, sapAccountId, permission, crud) => (
  new Promise(async (resolve, reject) => {
    const [error, userPermissions] = await to(fetchEntitlements(user));
    if (error) {
      reject(new Error('Unauthorized'));
    }
    const permissions = userPermissions.entitlements[sapAccountId];
    if (permissions === undefined || permissions[0] === undefined) {
      reject(new Error('Unauthorized'));
    }

    const shiro = shiroTrie.newTrie();
    shiro.add(permissions);
    const checkResult = shiro.permissions(permission);
    if ((crud === 'read' && checkResult.length) || checkResult.includes('write')) {
      resolve(true);
    }
    reject(new Error('Unauthorized'));
  })
);

export const getShadowAccess = async (userProfile, permission, crud) => (
  new Promise(async (resolve, reject) => {
    const combinations = [];
    const permissionAction = permission.split(':')[2];
    const [error, internalRoleArray] = await to(getAndMapPAPIGroups(userProfile));
    if (error) {
      console.log('Unauthorized! No Internal Permissions assigned.');
      reject(new Error('Unauthorized! No Internal Permissions assigned.'));
    }
    for (const role of internalRoleArray) {
      if ( role.permissions && role.permissions.length ) {
        const actionMatches = role.permissions.find(permissionString => permissionString.split(':')[2] === permissionAction);
        const crudMatches = role.access === crud;
  
        // if the internal role has the specified crud, and one of its permissions has the correct action
        // (in this case 'shadow-user'), then push that into the array of combinations
  
        if (actionMatches && crudMatches) {
          combinations.push({
            brand: role.brand, 
            country: role.country,
            persona: role.persona,
            lob: role.permissions[0].split(':')[0],
          })
        }
      }
    }

    resolve(combinations);
  })
);

export default verifyUserPermission;
