import { checkSchema, oneOf } from 'express-validator/check';

import {
  createUserAndLocations,
  deleteUserRole,
  getFlatLocations,
  getAccountsByUserId,
  editUserRole,
  updateUserData,
} from './users.controllers';
import asyncWrapper from '../../../asyncWrapper';
import { internalUserIsAuthorized, ensureRoleParamIsNotInternal, ensureRoleBodyIsNotInternal } from '../../middleware/internal-authorization';
import localProfileMiddleware from '../../middleware/localProfileMiddleware';
import { postUserFormRequirements } from '../../validator.util';

export const registerUsersRoutes = router => {

  // TODO: Select schema from request
  router.post('/users', [internalUserIsAuthorized, oneOf([
    checkSchema(postUserFormRequirements({ multiloc: true })),
    checkSchema(postUserFormRequirements({ multiloc: false })),
  ])], asyncWrapper(createUserAndLocations));

  router.get('/users/:federationId/flatten-locations', [localProfileMiddleware, internalUserIsAuthorized], getFlatLocations);

  router.delete('/users/:federationId/roles/:roleName/locations/:locationId', [localProfileMiddleware, internalUserIsAuthorized, ensureRoleParamIsNotInternal], asyncWrapper(deleteUserRole));

  router.put('/users/:federationId/roles/:roleName/locations/:locationId', [localProfileMiddleware, internalUserIsAuthorized, ensureRoleBodyIsNotInternal], asyncWrapper(editUserRole));

  router.put('/users/:userId/brands/:brand/personas/:persona', [localProfileMiddleware, internalUserIsAuthorized], asyncWrapper(updateUserData));

  // Purely for testing
  router.get('/users/:userId/brands/:brand/personas/:persona/accounts', asyncWrapper(getAccountsByUserId));
};

export default {
  registerUsersRoutes,
};
