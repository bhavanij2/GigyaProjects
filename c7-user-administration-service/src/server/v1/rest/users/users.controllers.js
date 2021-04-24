
import { validationResult } from 'express-validator/check';

import { getUserProfile } from '../../permissions.util';
import { TypedError, ErrorTypes } from '../../../errors';
import { postUserErrorFormatter } from '../../validator.util';

import { getAndSendUserInfoToCu360, updateCu360Status } from '../../../utils/cu360.utils';

import getFlattentedUsersLocationHierarchy from '../../locations/location.hierarchy.service.utils';

import { padSapAccount } from '../../../util';

import {
  addUserRoleService,
  createUserAndLocationsService,
  deleteUserRoleService,
  editUserRoleService,
  getAccountsByFedIdService,
  getAccountsByUserIdService,
  updateUserDataService,
  updateUserDataAndStatusService,
} from './users.persistence';

const getUsersQueryConditionals = query => {
  const conditionals = {
    first_name: query.firstname,
    last_name: query.lastname,
    id: query.email,
    city: query.city,
    state: query.state,
    location: query.location,
  };
  return conditionals;
};

export const getFlatLocations = async (req, res) => {
  const result = await getFlattentedUsersLocationHierarchy(decodeURIComponent(req.params.federationId));
  return res.send(result);
};

export const getAccountsByFedId = async (req, res, next) => {
  const result = await getAccountsByFedIdService(decodeURIComponent(req.params.federationId));
  res.send(result);
  next();
};

export const getAccountsByUserId = async (req, res, next) => {
  const result = await getAccountsByUserIdService(req.params.userId, req.params.brand, req.params.persona);
  res.json(result);
  next();
};

export const addUserRole = async (req, res) => {
  const userProfile = getUserProfile(req.headers['user-profile']);
  const result = await addUserRoleService({
    ...req.body,
    federationId: req.params.federationId,
    roleName: req.params.roleName,
    sapAccountId: req.params.locationId,
    adminId: userProfile.federationId || userProfile.email,
  });

  try {
    await getAndSendUserInfoToCu360(req.params.federationId);
  }
  catch (e) {
    console.error('Unable to update in customer 360', e);
    // TODO: Handle exception by sending slack alert
  }

  res.status(result.code).send(result.message);
};

export const deleteUserRole = async (req, res) => {
  const userProfile = getUserProfile(req.headers['user-profile']);
  const result = await deleteUserRoleService({
    ...req.body,
    federationId: req.params.federationId,
    roleName: req.params.roleName,
    sapAccountId: req.params.locationId,
    adminId: userProfile.federationId || userProfile.email,
  });

  try {
    await getAndSendUserInfoToCu360(req.params.federationId);
  }
  catch (e) {
    console.error('Unable to update in customer 360', e);
    // TODO: Handle exception by sending slack alert
  }
  res.status(result.code).send(result.message);
};

export const editUserRole = async (req, res) => {
  const userProfile = getUserProfile(req.headers['user-profile']);
  const adminId = userProfile.federationId || userProfile.email;
  const { lob, newRole } = req.body;
  const { federationId, locationId, roleName } = req.params;
  const oldRole = {
    lob,
    locationId,
    roleName,
  };
  const result = await editUserRoleService(federationId, oldRole, newRole, adminId);

  try {
    await getAndSendUserInfoToCu360(req.params.federationId);
  }
  catch (e) {
    console.error('Unable to update in customer 360', e);
    // TODO: Handle exception by sending slack alert
  }

  res.status(result.code).send(result.message);
};

const mapSingleLocationInput = (roles, sapId, sourceSystem) => {
  return roles.map(r => ({ roleId: r, sapId, sourceSystem }));
};

export const createUserAndLocations = async (req, res) => {
  const { multiLocation } = req.query;
  const { roleIdList, sapAccountId, sourceSystem } = req.body;

  const errors = validationResult(req).formatWith(postUserErrorFormatter);
  if (!errors.isEmpty()) {
    throw new TypedError(ErrorTypes.INVALID_INPUT, 'The information does not satisfy the requirements.', errors.array());
  }
  if (!multiLocation) {
    const paddedSapAccount = padSapAccount(sapAccountId);
    req.body.locationRoles = mapSingleLocationInput(roleIdList, paddedSapAccount, sourceSystem);
  } 
  
  const result = await createUserAndLocationsService(req.body);
  res.status(result.code).send(result.message);
};

export const updateUserData = async (req, res) => {
  const userProfile = getUserProfile(req.headers['user-profile']);
  const requesterId = userProfile.federationId || userProfile.email;

  const { updateTimestamp, federationId, ...properties } = req.body;
  const identity = { ...req.params, federationId };
  const { status } = properties;

  if (updateTimestamp) {
    const date = new Date();
    properties.lastLogin = date.toUTCString();
  }

  if (status) {
    if (!federationId) {
      throw new TypedError(ErrorTypes.INVALID_INPUT, 'User property "federationId" is required to update status');
    }
    const result = await updateUserDataAndStatusService(identity, properties, requesterId);

    await updateCu360Status(federationId, status);

    return res.status(result.code).send(result.message);
  }

  const result = await updateUserDataService(identity, properties);
  return res.status(result.code).send(result.message);
};

export default {
  addUserRole,
  createUserAndLocations,
  deleteUserRole,
  getFlatLocations,
  getAccountsByUserId,
};
