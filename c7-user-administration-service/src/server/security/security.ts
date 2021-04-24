import * as express from 'express';
import to from 'await-to-js';

import { getUserProfile } from '../v1/permissions.util';
import getInternalPermissions from '../v1/rest/groups/controllers/getPermissions';
import { getExternalPermissions, checkExternalAuthorization, checkInternalAuthorization } from './security.utils';

const expressAuthentication = async function (req: express.Request, authorizationType: string, scopes?: string[]): Promise<any> {
  if (authorizationType === 'external') {
    const userProfile = getUserProfile(req.headers['user-profile']);
    const [error, permissions] = await to(getExternalPermissions(userProfile));
    if (error) {
      return Promise.reject(new Error(`error fetching external permissions: ${error.message}`));
    }
    const clientIsAuthorized = checkExternalAuthorization(permissions, scopes);
    if (!clientIsAuthorized) {
      return Promise.reject(new Error(`(external) user lacks required permissions - ${scopes}`));
    }
    return Promise.resolve('external access');
  }
  if (authorizationType === 'internal') {
    const userProfile = getUserProfile(req.headers['user-profile']);
    const [error, permissions] = await to(getInternalPermissions(userProfile));
    if (error) {
      return Promise.reject(new Error(`error fetching internal permissions: ${error.message}`));
    }
    const clientIsAuthorized = checkInternalAuthorization(permissions, scopes);
    if (!clientIsAuthorized) {
      return Promise.reject(new Error(`(internal) user lacks required permissions - ${scopes}`));
    }
    return Promise.resolve('internal access');
  }
  if (authorizationType === 'api') {
    const { oauth_clientid } = req.headers;
    if (!oauth_clientid) {
      return Promise.reject(new Error('Could not find oauth_clientid'));
    }
    //@ts-ignore-line
    if (scopes && !scopes.includes(oauth_clientid)) {
      return Promise.reject(new Error('Supplied client ID does not have access'));
    }
    return Promise.resolve('api access');
  }
};

export {
  expressAuthentication,
};
