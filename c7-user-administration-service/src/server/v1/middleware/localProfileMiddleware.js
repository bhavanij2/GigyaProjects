import createProfileMiddleware from '@monsantoit/profile-middleware';

const localDevProfile = {
  id: 'test_user',
  entitlements: {
    'C7-INTERNAL-USER-ADMIN': ['internal-user-admin'],
  },
};

const localProfileMiddleware = createProfileMiddleware({ localDevProfile });

export default localProfileMiddleware;
