import ax from 'axios';
import deline from 'deline';

import userAdminConfig from '../config';

import {
  NewUserRequestOptions,
  UserProfileRequestOptions,
  UserRequestOptions,
  LocationRequestOptions,
  RegistrationOptions,
  APIPersona,
  AdminType,
  AdminContext,
  AdminHeaders,
  APIService,
  AdminEnvironmentOptions,
  AdminRolesRequestOptions
} from '../types';
import { Persona } from '@monsantoit/c7-elements/dist/types/types';

function getOptionalParameterString(name: string, value: string) {
  return value ? `${name}=${value}&` : '';
}

function formatSapId(sapId: string) {
  let formatted = sapId;
  while (formatted.length < 10) {
    formatted = `0${formatted}`;
  }
  return formatted;
}

function getPersona(adminType: AdminType): APIPersona {
  return adminType === 'Internal' ? 'internal' : 'dealer';
}

function getAuthHeader(context: AdminContext): string {
  return `Bearer ${context.adminType === 'Internal' ? context.internalToken : context.externalToken}`;
}

export function getAdminHeaders(context: AdminContext): AdminHeaders {
  return {
    headers: {
      AdminType: context.adminType,
      Authorization: getAuthHeader(context)
    }
  }
}

function getInternalUATargetPersonaOverride() : Persona {
  return {
    brand: 'national',
    userType: 'dealer'
  }
}

const USERADMIN: APIService = 'useradmin';

export class Agent {
  // create axios instance with options
  // so we don't interfere with the global's defaults
  private axios = ax.create({
    timeout: 60 * 1000,
  });

  // todo: add type
  public async editUserRole(options: any, context: AdminContext) {
    const { env, fedId, oldRole, newRole } = options;
    const { roleName, locationId, lob } = oldRole;
    const config = userAdminConfig(env);

    const headers = getAdminHeaders(context);
    const request = `/users/${fedId}/roles/${roleName}/locations/${locationId}`;
    const body = { lob, newRole };
    // tslint:disable-next-line:max-line-length
    const response = this.axios.put(`${config.api.services(getPersona(context.adminType), USERADMIN)}${request}`, body, headers);
    return response;
  }

  public async fetchUsers(options: any, context: AdminContext) {
    const { env } = options;
    const config = userAdminConfig(env);

    const headers = getAdminHeaders(context);
    const formattedSapId = options.sapId ? formatSapId(options.sapId) : '';
    const formattedHqSapId = options.hqSapId ? formatSapId(options.hqSapId) : '';
    const request = (options.first_name || options.last_name || formattedSapId ||
      formattedHqSapId || options.id || options.status || options.testUser ||
      options.brand || options.country || options.persona) ?
      deline`\
        ${getOptionalParameterString('first_name', options.first_name)}\
        ${getOptionalParameterString('last_name', options.last_name)}\
        ${getOptionalParameterString('hqSapId', formattedHqSapId)}\
        ${getOptionalParameterString('sapId', formattedSapId)}\
        ${getOptionalParameterString('id', options.id)}\
        ${getOptionalParameterString('status', options.status)}\
        ${getOptionalParameterString('testUser', options.testUser)}\
        ${getOptionalParameterString('brand', options.brand)}\
        ${getOptionalParameterString('persona', options.persona)}\
        ${getOptionalParameterString('country', options.country)}` : '';
    const baseUrl = config.api.services(getPersona(context.adminType), USERADMIN);
    const response = await this.axios.get(`${baseUrl}/users?internal=false&${request}`, headers);
    return response.data;
  }

  // todo: add type
  public async grantUserNewRole(options: any, context: AdminContext) {
    const { env, fedId, role } = options;
    const { lob, locationId, roleName } = role;
    const config = userAdminConfig(env);

    const headers = getAdminHeaders(context);
    const request = `/users/${fedId}/roles/${roleName}/locations/${locationId}`;
    const body = { lobList: [ lob ] };

    // tslint:disable-next-line:max-line-length
    const response = this.axios.post(`${config.api.services(getPersona(context.adminType), USERADMIN)}${request}`, body, headers);
    return response;
  }

// TODO: add authorization once it's figured out
  public async getEmailAvailability(options: NewUserRequestOptions, context: AdminContext) {
    const { env, userId } = options;
    const { brand, userType } = context.adminType === 'Internal' ? getInternalUATargetPersonaOverride() : options;

    const config = userAdminConfig(env);

    const headers = getAdminHeaders(context);
    const baseUrl = config.api.registration(context.adminType);

    const request = `/check-email/${userId}/brand/${brand}/user-type/${userType}`;

    const response = await this.axios.get(`${baseUrl}${request}`, headers);
    return response.data;
  }

  public async getLocationInfo(options: LocationRequestOptions, context: AdminContext) {
    const { env, locationId } = options;
    const config = userAdminConfig(env);

    const headers = getAdminHeaders(context);
    const body = { sapLocationId: locationId };
    const baseUrl = config.api.services(getPersona(context.adminType), USERADMIN);

    /* tslint:disable-next-line */
    const response = await this.axios.post(`${baseUrl}/locations`, body, headers);
    return response.data;
  }

  public async getLocationChildren(options: LocationRequestOptions, context: AdminContext) {
    const { env, locationId } = options;
    const config = userAdminConfig(env);

    const headers = getAdminHeaders(context);
    const baseUrl = config.api.services(getPersona(context.adminType), USERADMIN);

    const response = await this.axios.get(`${baseUrl}/search/${locationId}/children`, headers);
    return response.data;
  }

  public async getUserProfile(options: UserProfileRequestOptions, context: AdminContext) {
    const { env, fedId } = options;
    const config = userAdminConfig(env);

    const headers = getAdminHeaders(context);
    const baseUrl = config.api.services(getPersona(context.adminType), USERADMIN);

    const response = await this.axios.get(`${baseUrl}/users/${fedId}/info`, headers);
    return response.data;
  }

  public async getAdminRoles(options: AdminRolesRequestOptions, context: AdminContext) {
    const { env, beta, brand, persona, country, lob } = options
    const config = userAdminConfig(env);
    const headers = getAdminHeaders(context);
    const baseUrl = config.api.services(getPersona(context.adminType), USERADMIN);

    let query = 'internal=false';
    if (beta) { query = `${query}&beta=${beta}`}
    if (brand) { query = `${query}&brand=${brand}`; }
    if (persona) { query = `${query}&persona=${persona}`; }
    if (country) { query = `${query}&country=${country}`; }
    if (lob) { query = `${query}&lob=${lob}` }
    const response = await this.axios.get(`${baseUrl}/roles?${query}`, headers);
    return response.data;
  }

  // todo: add type
  public async getAdminLocations(options: any, context: AdminContext) {
    const { env, fedId } = options;
    const config = userAdminConfig(env);

    const headers = getAdminHeaders(context);
    const baseUrl = config.api.services(getPersona(context.adminType), USERADMIN);

    const response = await this.axios.get(`${baseUrl}/users/${fedId}/flatten-locations`, headers);
    return response.data;
  }

  public async getAdminLocationsByHqSapId(options: any, context: AdminContext) {
    const { env, hqSapId, persona } = options;
    const config = userAdminConfig(env);

    const headers = getAdminHeaders(context);
    const baseUrl = config.api.services(getPersona(context.adminType), USERADMIN);
    const formattedHqSapId = formatSapId(hqSapId);
    const query = persona ? `?persona=${persona}` : '';

    const response = await this.axios.get(
      `${baseUrl}/locations/${formattedHqSapId}/flattened-locations${query}`,
      headers
    );
    return response.data;
  }

  public async preregister(options: RegistrationOptions, context: AdminContext) {
    const { env, ...body } = options;
    const config = userAdminConfig(env);

    const headers = getAdminHeaders(context);
    const baseUrl = config.api.registration(context.adminType);

    const response = await this.axios.post(`${baseUrl}/pre-register/uadmin?sendEmail=true`, body, headers);
    return response.data;
  }

  // todo: add type
  public async removeUserRole(options: any, context: AdminContext) {
    const { env, fedId, role } = options;
    const { lob, locationId, roleName } = role;
    const config = userAdminConfig(env);

    const { headers } = getAdminHeaders(context);
    const request = `/users/${fedId}/roles/${roleName}/locations/${locationId}`;
    const body = { lobList: [ lob ] };

    // tslint:disable-next-line:max-line-length
    const response = this.axios.delete(`${config.api.services(getPersona(context.adminType), USERADMIN)}${request}`, {headers, data: body});
    return response;
  }

  public async changeUserStatus(options: any, context: AdminContext){
    const { brand, env, federationId, persona, status, userId } = options;
    const config = userAdminConfig(env);
    const headers = getAdminHeaders(context);
    const request = `/users/${userId}/brands/${brand}/personas/${persona}`;
    const body = { status, federationId };
    // tslint:disable-next-line:max-line-length
    const response = this.axios.put(`${config.api.services(getPersona(context.adminType), USERADMIN)}${request}`, body, headers);
    return response;
  }
  // we could at this point pass in the persona in line 202 above
  // if there will ever be an activate/deactivate call for a non-dealer

  public async fetchCompanyHqs(options: AdminEnvironmentOptions, context: AdminContext) {
    const { env } = options;
    const config = userAdminConfig(env);

    const headers = getAdminHeaders(context);

    const baseUrl = config.api.services(getPersona(context.adminType), USERADMIN);
    const getUrl = `${baseUrl}/hq`;

    const response = await this.axios.get(getUrl, headers);

    return response.data;
  }

  public async getInternalEntitlements(options: any, context: AdminContext) {
    const { env } = options;
    const config = userAdminConfig(env);
    const headers = getAdminHeaders(context);
    const baseUrl = config.api.services(getPersona(context.adminType), USERADMIN);

    const response = await this.axios.get(`${baseUrl}/groups/permissions`, headers);
    return response.data;
  }
 }

export default new Agent();
