/**
 * User Profile Middleware
 * @description Captures 'user-profile' from headers passed by Ocelot and applys it to the Express req object to be used by controllers
 */
const { services } = require('@monsantoit/cloud-foundry');

export default function UserProfileFromHeaders(req, res, next) {
  const userProfileFromHeader = req.headers['user-profile'];

  req.userProfile = {};
  if (process.env.LOCAL_USER_PROFILE) {
    req.userProfile.federationId = services['user-profile'].federationId;
    req.userProfile.id = services['user-profile'].id;

    return next();
  }

  if (userProfileFromHeader) {
    try {
      req.userProfile = JSON.parse(userProfileFromHeader);
    }
    catch (exception) {
      console.error('UserProfileMiddleware [Error]: %O', exception);
    }
  }

  return next();
}
