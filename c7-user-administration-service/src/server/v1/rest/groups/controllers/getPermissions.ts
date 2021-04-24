import axios from 'axios';
import { to } from 'await-to-js';

import { getAuthToken } from '../../utils';
import { getPermissionsService } from '../services';
import { mapPermissionRecord, formatPermissionRecord } from '../mappers';
import { VelocityGroup } from '../types';
import { ErrorTypes, TypedError } from '../../../../errors';

async function getUserGroupsFromPAPI(profile): Promise<VelocityGroup[]> {
  const token = await getAuthToken();
  const { id } = profile;
  const response = await axios.post(
    `${process.env.papi}/graphql`,
    { query: `{getUserById(id:"${id}"){groups{id}}}` },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  // this is how the velocity team checks for unauthorized in their own client
  const pingRedirect = !response.data.data &&
      response.data.indexOf('<base href="https://test.amp.monsanto.com/"/>') > -1;
  if (pingRedirect) {
    throw new TypedError(
      ErrorTypes.UNAUTHORIZED,
      'Unable to fetch user Groups because a valid PAPI token was not provided',
    );
  }
  const { groups } = response.data.data.getUserById;
  return groups;
}

export const getAndMapPAPIGroups = async profile => {
  const groups = await getUserGroupsFromPAPI(profile);
  const result = await getPermissionsService(groups);
  return mapPermissionRecord(result);
};

async function getPermissionsFromUserGroup(profile) {

  const [recordsError, records] = await to(getAndMapPAPIGroups(profile));
  if (recordsError) {
    throw new TypedError(
      ErrorTypes.INTERNAL_SERVER_ERROR,
      recordsError.message,
      recordsError,
    );
  }

  return formatPermissionRecord(records);
}

export default getPermissionsFromUserGroup;
