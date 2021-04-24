import asyncWrapper from '../../../asyncWrapper';
import {
  getLobByHqSapId,
  fetchLocations,
  updateLocationInfo,
} from './locations.controllers';

import { internalUserIsAuthorized } from '../../middleware/internal-authorization';
import localProfileMiddleware from '../../middleware/localProfileMiddleware';


// TODO: Migrate to routes.ts
function registerLocationsRoutes(router) {
  router.get('/locations/:hqSapId/flattened-locations', [localProfileMiddleware, internalUserIsAuthorized], asyncWrapper(getLobByHqSapId));
  router.put('/locations/:sapId', [localProfileMiddleware, internalUserIsAuthorized], asyncWrapper(updateLocationInfo));
  router.get('/locations' , asyncWrapper(fetchLocations));
}

export default registerLocationsRoutes;
