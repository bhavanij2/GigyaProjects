import bodyParser from 'body-parser';
import { Router } from 'express';

import { getEntitlements } from '../v1/controllers/entitlement';
import { getAccounts } from '../v1/controllers/account';

const router = new Router();

router.use(bodyParser.json({ limit: '1mb' }));

router.get('/entitlements/:application?', getEntitlements);
router.get('/accounts', getAccounts);

export default router;
