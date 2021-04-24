import UserProfileMiddleware from '../../src/server/v1/middleware/user-profile.middleware';

jest.mock('@monsantoit/cloud-foundry', () => ({
  services: {
    'user-profile': {
      federationId: 1024
    }
  }
}));

describe('UserProfile Middleware', () => {
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    delete process.env.LOCAL_USER_PROFILE;
  });
  it('Returns a userProfile object on req from headers', () => {
    const next = jest.fn();
    const { req, res } = ExpressMock({headers: { 'user-profile': JSON.stringify({test: 1024}) }});

    UserProfileMiddleware(req, res, next);


    expect(next).toBeCalled();
    expect(req).toHaveProperty('userProfile');
    expect(req.userProfile).toHaveProperty('test');
  });
  it('Returns an empty userProfile object if the header is not valid', () => {
    const next = jest.fn();
    const { req, res } = ExpressMock({ headers: { 'user-profile': 'INVALID JSON' } });

    UserProfileMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(Object.keys(req.userProfile).length).toBe(0);
  });
  it('Returns a userProfile object with only the federationId if LOCAL_USER_PROFILE env var is set', () => {
    const next = jest.fn();
    const { req, res } = ExpressMock();

    process.env.LOCAL_USER_PROFILE = true;

    UserProfileMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.userProfile).toHaveProperty('federationId');
  });
});
