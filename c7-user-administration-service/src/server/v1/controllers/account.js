import { to } from 'await-to-js';
import { getUserProfile, getShadowAccess } from '../permissions.util';
import { fetchUserWithAccountsByFederationId } from '../persistence/account';
import { getFederationId } from '../persistence/shadow';

export async function getAccounts(req, res) {
  const sendError = error => {
    console.error(error);
    return res.status(500).send({ error: error.message });
  };
  const userProfile = getUserProfile(req.headers['user-profile']);
  const [errorGettingFederationId, user] = await to(getFederationId(userProfile.federationId));
  if (errorGettingFederationId) return sendError(errorGettingFederationId);
  
  let scopes = [];
  if (user.shadow) {
    scopes = await getShadowAccess(userProfile, '$:shadowing:shadow-user:?', 'read');
  }
  
  const [errorFetchAccounts, accounts] = await to(fetchUserWithAccountsByFederationId(user, scopes));
  if (errorFetchAccounts) return sendError(errorFetchAccounts);
  return res.status(200).send(accounts);
}
