import { postUserFormRequirements } from '../../src/server/v1/validator.util';

describe('post user validator', () => {
  it('returns the correct requirements for method POST to route with multiloc false /users', () => {
    const stringRequired = field => ({
      in: ['body'],
      errorMessage: `A value in field ${field} is required.`,
      isString: true,
      isLength: {
        options: { min: 1 },
      },
    });
    const arrayRequired = field => ({
      in: ['body'],
      errorMessage: `A nonempty array is required for field ${field}.`,
      isArray: true,
      isLength: {
        options: { min: 1 },
      },
    });
    const expectedRequirements = {
      federationId: stringRequired('federationId'),
      userId: stringRequired('userId'),
      userName: stringRequired('userName'),
      brand: stringRequired('brand'),
      persona: stringRequired('persona'),
      sapAccountId: stringRequired('sapAccountId'),
      firstName: stringRequired('firstName'),
      lastName: stringRequired('lastName'),
      roleIdList: arrayRequired('roleIdList'),
    };
    expect(postUserFormRequirements({ multiloc: false })).toEqual(expectedRequirements);
  });

  it('returns the correct requirements for method POST to route with multiloc true /users', () => {
    const stringRequired = field => ({
      in: ['body'],
      errorMessage: `A value in field ${field} is required.`,
      isString: true,
      isLength: {
        options: { min: 1 },
      },
    });
    const arrayRequired = field => ({
      in: ['body'],
      errorMessage: `A nonempty array is required for field ${field}.`,
      isArray: true,
      isLength: {
        options: { min: 1 },
      },
    });
    const expectedRequirements = {
      federationId: stringRequired('federationId'),
      userId: stringRequired('userId'),
      userName: stringRequired('userName'),
      brand: stringRequired('brand'),
      persona: stringRequired('persona'),
      firstName: stringRequired('firstName'),
      lastName: stringRequired('lastName'),
      locationRoles: arrayRequired('locationRoles'),
    };
    expect(postUserFormRequirements({ multiloc: true })).toEqual(expectedRequirements);
  });
});
