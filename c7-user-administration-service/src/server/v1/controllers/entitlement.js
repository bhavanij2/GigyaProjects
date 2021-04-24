/**
 * Entitlement Controller
 *
 *
 */

import { to } from 'await-to-js';
import { getUserProfile, getShadowAccess } from '../permissions.util';
import { getFederationId } from '../persistence/shadow';
import { fetchEntitlements } from '../persistence/entitlement';
import { performance } from 'perf_hooks';

export async function getEntitlements(req, res) {
  let scopes = [];
  const sendError = error => {
    console.error(error);
    return res.status(500).send({ error: error.message });
  };
  var t0 = performance.now()

  const userProfile = getUserProfile(req.headers['user-profile']);
  var f0 = performance.now()
  const [errorGettingFederationId, user] = await to(getFederationId(userProfile.federationId));
  if (errorGettingFederationId) return sendError(errorGettingFederationId);

  if (user.shadow) {
    scopes = await getShadowAccess(userProfile, '$:shadowing:shadow-user:?', 'read');
  }
  var f1 = performance.now()
  console.log("federation call " + (f1 - f0) + " milliseconds.");
  const [errorFetchingEntitlements, result] = await to(fetchEntitlements(user, scopes));
  if (errorFetchingEntitlements) return sendError(errorFetchingEntitlements);

  var t1 = performance.now()
  console.log("outer entitlements call " + (t1 - t0) + " milliseconds.");

  return res.status(200).send(result);
}
