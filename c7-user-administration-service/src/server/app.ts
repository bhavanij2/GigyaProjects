// Replace the use of polyfills for Babel 7+ with core-js 3
import './tracer';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as expressValidator from 'express-validator';
import { urlencoded } from 'body-parser';
import { requestLoggingMiddleware, wrapConsoleWithElkHelper } from '@monsantoit/console-elk';
import * as express from 'express';

import './defaultBindings';

import v1 from './v1/index';
import v2 from './v2/index';
import {
  logError,
  errorHandler,
} from './errors';

import UserProfileMiddleware from './v1/middleware/user-profile.middleware';
import { RegisterRoutes } from './generated/v1-routes/routes';

import { serve, setup } from 'swagger-ui-express';

const app = express();

app.use(UserProfileMiddleware);

app.use(requestLoggingMiddleware());
app.use(urlencoded({ extended: true }));
app.use(expressValidator());

wrapConsoleWithElkHelper({
  app: 'acs2-c7-user-administration-service',
  shouldColorizeLocal: false,
  formatForElk: (functionName, options, consoleArgs) => {
    const formattedArgs = Object.values(consoleArgs).join(' ');
    return `app="${options.app}"\n
    log_level="${functionName}"\n
    instance="${process.env.CF_INSTANCE_INDEX}"\n
    ${formattedArgs}`;
  },
});

if (process.env.NODE_ENV !== 'production') {
  const cors = require('cors') //eslint-disable-line
  const corsMiddleware = cors({
    origin: (origin, corsCb) => corsCb(null, true),
  });

  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Credentials', 'true');
    corsMiddleware(req, res, next);
  });
}

app.use((req, res, next) => {
  if (req.headers.authorization) {
    global.authToken = /[Bb]earer (.*)/.exec(req.headers.authorization)[1];
  }

  next();
});

app.use('/v1', v1);
app.use('/v2', v2);

RegisterRoutes(app);
app.use('/swagger.json', express.static(__dirname + '/swagger.json'));
app.use('/api-docs', serve, setup(null, { swaggerOptions: {
  url: '/swagger.json'
}}));

app.use(logError);
app.use(errorHandler);

export default app;
