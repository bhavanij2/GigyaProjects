import { to } from 'await-to-js';
import { getUserProfile } from '../../src/server/v1/permissions.util';
import * as Test from '../../src/server/v1/validator/user-profile';

jest.mock('../../src/server/v1/permissions.util', () => ({
  getUserProfile: jest.fn(),
}));

describe('UserProfile Validator', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('validation error when user profile does not exist', async () => {
    getUserProfile.mockReturnValue(undefined);

    const [error] = await to(Test.validate(undefined));

    expect(error).toStrictEqual(new Error('user-profile required'));
    expect(getUserProfile).toBeCalledWith(undefined);
  });

  it('validation error when federationId does not exist', async () => {
    const userProfile = {};
    getUserProfile.mockReturnValue(userProfile);

    const [error] = await to(Test.validate(userProfile));

    expect(error).toStrictEqual(new Error('federationId required'));
    expect(getUserProfile).toBeCalledWith(userProfile);
  });

  it('validation error when firstName does not exist', async () => {
    const userProfile = {
      federationId: 'abcd',
    };
    getUserProfile.mockReturnValue(userProfile);

    const [error] = await to(Test.validate(userProfile));

    expect(error).toStrictEqual(new Error('firstName required'));
    expect(getUserProfile).toBeCalledWith(userProfile);
  });

  it('validation error when lastName does not exist', async () => {
    const userProfile = {
      federationId: 'abcd',
      firstName: 'diana',
    };
    getUserProfile.mockReturnValue(userProfile);

    const [error] = await to(Test.validate(userProfile));

    expect(error).toStrictEqual(new Error('lastName required'));
    expect(getUserProfile).toBeCalledWith(userProfile);
  });

  it('validation error when email does not exist', async () => {
    const userProfile = {
      federationId: 'abcd',
      firstName: 'diana',
      lastName: 'prince',
    };
    getUserProfile.mockReturnValue(userProfile);

    const [error] = await to(Test.validate(userProfile));

    expect(error).toStrictEqual(new Error('email required'));
    expect(getUserProfile).toBeCalledWith(userProfile);
  });

  it('passes validation', async () => {
    const userProfile = {
      federationId: 'abcd',
      firstName: 'diana',
      lastName: 'prince',
      email: 'diana.prince@bayer.com',
    };
    getUserProfile.mockReturnValue(userProfile);

    const [error, result] = await to(Test.validate(userProfile));

    expect(error).toBeNull();
    expect(result).toBeTruthy();
    expect(getUserProfile).toBeCalledWith(userProfile);
  });
});
