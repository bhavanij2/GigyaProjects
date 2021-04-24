/**
 * User Controller
 *
 *
 */

import { to } from 'await-to-js';
import { validationResult } from 'express-validator/check';
import uuid from 'uuid/v1';
import { getUserProfile } from '../permissions.util';
import { createInternalUser as persistInternalUser, getUser } from '../persistence/user';
import { deleteShadowRelationship } from '../persistence/shadow';

export async function createInternalUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errors: errors.array() });
  }

  const sendError = error => {
    console.error(error);
    return res.status(500).send({ error: error.message });
  };

  // Same transaction id for audit logging
  const transactionId = uuid();

  const userProfile = getUserProfile(req.headers['user-profile']);

  const [getUserError, user] = await to(getUser(userProfile.federationId));
  if (getUserError) return sendError(getUserError);

  if (user) {
    const [deleteError] = await to(deleteShadowRelationship(userProfile.federationId, transactionId));
    if (deleteError) return sendError(deleteError);
    return res.status(200).send({ message: 'User exists' });
  }

  const [createError, result] = await to(persistInternalUser(userProfile, transactionId));
  if (createError) return sendError(createError);

  return res.status(200).send({ message: result });
}
