/**
 * Shadow Controller
 *
 *
 */

import { to } from 'await-to-js';
import { validationResult } from 'express-validator/check';
import uuid from 'uuid/v1';
import { getUserProfile, getShadowAccess } from '../permissions.util';
import { createShadowRelationship, deleteShadowRelationship } from '../persistence/shadow';
import { getUser, updateUserBrandAndPersona } from '../persistence/user';

const shadow_permission = '$:shadowing:shadow-user:?';
const shadow_permission_crud = 'read';

export async function shadow(req, res) {
  // Has Permission
  const userProfile = getUserProfile(req.headers['user-profile']);
  const [authorizedError, authorized] = await to(getShadowAccess(userProfile, shadow_permission, shadow_permission_crud));
  if (authorizedError) {
    return res.status(500).send({ error: authorizedError.message });
  }
  if (authorized.length === 0) {
    return res.status(400).send({ error: 'Not authorized to shadow'});
  }
  // Validate Data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const sendError = error => {
    console.error(error);
    return res.status(500).send({ error: error.message });
  };

  // Fetch the user to shadow
  const [getUserError, userToShadow] = await to(getUser(req.params.federationId));
  if (getUserError) {
    return sendError(getUserError);
  }

  // Same transaction id for audit logging
  const transactionId = uuid();

  // Update the person that will be shadowing to have the same brand and persona
  const [error] = await to(updateUserBrandAndPersona(userProfile, userToShadow.brand, userToShadow.persona, transactionId));
  if (error) {
    return sendError(error);
  }

  // Remove any existing shadow relationships and create a new one
  const promises = [
    deleteShadowRelationship(userProfile.federationId, transactionId),
    createShadowRelationship(userProfile.federationId, req.params.federationId, transactionId),
  ];

  const [deleteShadow, createShadow] = await Promise.all(
    promises.map(p => p.then(d => [null, d]).catch(e => [e, null])),
  );

  const [deleteShadowError] = deleteShadow;
  const [createShadowError, createShadowResult] = createShadow;

  if (deleteShadowError || createShadowError) {
    return sendError(deleteShadowError || createShadowError);
  }

  // All good, send a happy response :)
  return res.status(200).send({ message: createShadowResult });
}

export async function checkShadowAccess(req, res) {
  const userProfile = getUserProfile(req.headers['user-profile']);
  const [accessError, access] = await to(getShadowAccess(userProfile, shadow_permission, shadow_permission_crud));
  if (accessError) {
    return res.status(500).send({ error: `Error while getting shadowing access: ${accessError}`})
  }
  if (!access || access.length === 0) {
    return res.status(401).send({ error: 'User is not authorized to shadow' });
  }
  return res.status(200).send({ authorized: true });
}
