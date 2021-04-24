import { Router } from 'express';
import { json } from 'body-parser';
import { registerUsersRoutes } from './users/users.routes';
import registerLocationsRoutes from './locations/locations.routes';

import './healthcheck/routes';
import './users/routes';
import './hq/routes';
import './roles/routes';
import './permissions/routes';
import './featuresets/routes';
import './locations/routes';
import './groups/routes';

const router = Router();

router.use(json({ limit: '1mb' }));
registerUsersRoutes(router);
registerLocationsRoutes(router);

router.get('/status', (req, res) => {
  res.json('running');
});

export default router;
