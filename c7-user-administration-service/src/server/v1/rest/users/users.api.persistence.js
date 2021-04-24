import axios from 'axios';
import combineErrors from 'combine-errors';
import { to } from 'await-to-js';
import { stringify } from 'query-string';
import generateBearerToken from '../../../utils/auth.utils';

export const queryParameterString = conditionals => {
  const params = {
    email: conditionals.id,
    'first-name': conditionals.first_name,
    'last-name': conditionals.last_name,
    city: conditionals.city,
    state: conditionals.state,
    'sap-location-id': conditionals.sapId,
    'hq-sap-id': conditionals.hqSapId,
    persona: conditionals.persona?.replace('*', 'ASTERISK'),
    brand: conditionals.brand,
    country: conditionals.country,
  };

  const queryParam = stringify(params);

  return queryParam ? `?${queryParam}` : '';
};
/**
   * @function pendingUsers
   * @async
   * @private
   * @param {String} sapId - User SAP ID
   * @description Fetches users who have not yet completed their registration from registration API
   * @returns {Promise<Array>} Response from User Registration API
   */
export const pendingUsers = async conditionals => {
  const url = `${process.env.akana_url}/c7-user-registration-api/users/pending${queryParameterString(conditionals)}`;
  const config = {
    headers: {
      Authorization: `Bearer ${await generateBearerToken()}`,
    },
  };
  console.log(url);
  const [err, response] = await to(axios.get(url, config));

  return err ? Promise.reject(combineErrors([new Error('Failed to request user hierarchy'), err])) : Promise.resolve(response.data);
};
