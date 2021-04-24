import { ResponseCodes } from '../../../response.utils';
import {
  getEntitlementsFromRole,
  getRolesFromEntitlement,
} from './velocity-mappings';

const isAuthorized = (entitlements, validEntitlements) => validEntitlements
  .reduce((isAllowed, entitlement) => isAllowed
      || entitlements.includes(entitlement), false);

const getRolesFromEntitlements = async (entitlements, docClient) => entitlements
  .reduce(async (roles, entitlement) => [
    ...roles,
    await getRolesFromEntitlement(entitlement, docClient),
  ], []);

const fail = (res, status, msg) => res
  .status(status)
  .send({ error: msg || 'Failed to complete search. Please try again later.' });

export const internalUserIsAuthorized = async (req, res, next) => {
  if (!(req.headers.admintype === 'Internal')) {
    return next();
  }
  try {
    const validEntitlements = await getEntitlementsFromRole(
      'glb:int-ua:ad',
      req.app.locals.docClient,
    );

    const userProfile = JSON.parse(req.headers['user-profile']);
    const userEntitlements = userProfile.entitlements['c7-internal-user-admin'] || [];

    if (!isAuthorized(userEntitlements, validEntitlements)) {
      return fail(
        res,
        ResponseCodes.UNAUTHORIZED,
        'This user is not authorized to search users.',
      );
    }

    req.internalUserRoles = await getRolesFromEntitlements(userEntitlements, req.app.locals.docClient);
    return next();
  }
  catch (error) {
    return fail(
      res,
      ResponseCodes.INTERNAL_SERVER_ERROR,
      process.env.NODE_ENV !== 'production' ? error.message : null,
    );
  }
};

export const ensureRoleParamIsNotInternal = async (req, res, next) => {
  if (req.params.roleName === 'Internal Admin') {
    return fail(
      res,
      ResponseCodes.UNAUTHORIZED,
      'Not authorized to add an internal role.',
    );
  }

  return next();
};

export const ensureRoleBodyIsNotInternal = async (req, res, next) => {
  if (req.body.newRole === 'Internal Admin') {
    return fail(
      res,
      ResponseCodes.UNAUTHORIZED,
      'Not authorized to add an internal role.',
    );
  }

  return next();
};

export default {
  internalUserIsAuthorized,
  ensureRoleParamIsNotInternal,
  ensureRoleBodyIsNotInternal,
};
