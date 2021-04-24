import {
  param,
  header,
} from 'express-validator/check';
import asyncWrapper from '../asyncWrapper';
import {
  getUsersWithRolesByLocation,
  deleteUsers,
  getLocation,
  updateUserDataListByFedId,
} from './entitlements';

import {
  getUsersLocationHierarchy,
} from './locations';
import {
  getUserProfile,
} from './permissions.util';
import {
  getPermissions,
  getPermissionsByRole,
} from './entitlements/self.service';
import {
  getProfileByFederationIdService,
  getAccountsByFedIdService,
  getUserEntitlements,
  getUserApplicationEntitlements,
} from './rest/users/users.persistence';

import {
  searchLocationsFromQuery,
  requestUserAccountsFromLocation,
} from './controllers/search';
import { createInternalUser } from './controllers/user';
import { validate as validateUserProfile } from './validator/user-profile';
import { shadow, checkShadowAccess } from './controllers/shadow';
import router from './rest/router';

router.get('/search/:sapId/children', searchLocationsFromQuery);
router.get('/locations/:sapAccountId/users', requestUserAccountsFromLocation);

/**
 *  @deprecated - use v2 - supports shadowing
 */
router.get('/entitlements/:application?', asyncWrapper(async (req, res, next) => {
  const userProfile = getUserProfile(req.headers['user-profile']);
  if (req.params.application) {
    const result = await getUserApplicationEntitlements(userProfile.federationId, req.params.application);
    res.json(result);
  }
  else {
    const result = await getUserEntitlements(userProfile.federationId);
    res.json(result);
  }
  next();
}));

router.get('/locations/:id/users', asyncWrapper(async (req, res) => {
  const result = await getUsersWithRolesByLocation(req.params.id);
  res.json(result);
}));

router.post('/internal-users', header('user-profile').custom(validateUserProfile), createInternalUser);

router.post('/internal-users/shadow/:federationId', [
  param('federationId').not().isEmpty(),
], shadow);


router.get('/internal-users/shadow/access', header('user-profile').custom(validateUserProfile), checkShadowAccess);

router.delete('/users/:federationId', asyncWrapper(async (req, res) => {
  const result = await deleteUsers(req.params.federationId);
  res.json(result);
}));

// TODO: GCX-1391
router.get('/profile', asyncWrapper(async (req, res) => {
  const userProfile = getUserProfile(req.headers['user-profile']);
  const result = await getProfileByFederationIdService(userProfile.federationId);
  res.json(result);
}));

// Location Service Calls

router.get('/users/:federationId/locations', asyncWrapper(async (req, res) => {
  const result = await getUsersLocationHierarchy(decodeURIComponent(req.params.federationId));
  res.send(result);
}));

// TODO: GCX-1391
router.get('/accounts', asyncWrapper(async (req, res, next) => {
  const userProfile = getUserProfile(req.headers['user-profile']);
  const result = await getAccountsByFedIdService(decodeURIComponent(userProfile.federationId));
  res.send(result);
  next();
}));

// Self-Service

router.get('/roles/:id/permissions', asyncWrapper(async (req, res) => {
  const result = await getPermissionsByRole(req.params.id);
  res.status(result.code).send(result.message);
}));

router.get('/permissions', asyncWrapper(async (req, res) => {
  const result = await getPermissions(req.query.application);
  res.status('200').send(result);
}));

router.post('/locations', asyncWrapper(async (req, res) => {
  const sourceSystem = req.query.sourceSystem ? req.query.sourceSystem : 'sap-customer-number'
  const country = req.query.country ? req.query.country : 'US'
  const portal = req.query.portal ? req.query.portal : 'mycrop'
  const result = await getLocation(req.body.sapLocationId, sourceSystem, country, portal);
  res.status('200').send(result);
}));

// endpoints for updating individual user info

router.put('/users', asyncWrapper(async (req, res) => {
  const result = await updateUserDataListByFedId(req.body.users);
  res.status('200').send(result);
}));

router.get('/health', asyncWrapper(async (req, res) => {
  res.status('200').send("OK");
}));

export default router;
