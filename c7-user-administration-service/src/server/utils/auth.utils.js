import combineErrors from 'combine-errors';
import { to } from 'await-to-js';
import oauth from '@monsantoit/oauth-ping';

/**
 * @function generateBearerToken
 * @async
 * @private
 * @returns {String} Client Token
 * @description Creates a client token for Monsanto API endpoints
 */
async function generateBearerToken() {
  console.log(JSON.stringify(process.env));
  const OAUTH_TOKEN_CONFIG = {
    clientId: process.env.client_id,
    clientSecret: process.env.client_secret,
    url: process.env.PING_URL,
  };
  const [tokenRequestError, token] = await to(oauth.httpGetToken(OAUTH_TOKEN_CONFIG)());

  if (tokenRequestError) {
    throw combineErrors([new Error('Failed to generate oauth token'), tokenRequestError]);
  }

  return token;
}

export default generateBearerToken;
