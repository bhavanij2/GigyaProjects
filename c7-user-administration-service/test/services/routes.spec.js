import request from 'supertest';
import {
  TypedError,
  ErrorTypes,
} from '../../src/server/errors';
import { readTransaction } from '../../src/server/v1/neo4j.utils';
import app from '../../src/server/app';

jest.mock('../../src/server/v1/neo4j.utils', () => ({
  readTransaction: jest.fn(),
}));

describe('routes', () => {
  it('GET /status responds with running', async () => {
    return request(app).get('/v1/status')
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.type).toEqual('application/json');
        expect(response.body).toEqual('running');
      });
  });

  it('POST /users responds with error response with correct details when required body field is missing', async () => {
    const requestBody = {
      federationId: '',
      userId: 'a@a.com',
      userName: 'a',
      brand: 'channel',
      persona: 'dealer',
      sapAccountId: '123456',
      roleIdList: ['', ''],
      firstName: 'a',
      lastName: '',
      addressLine1: '123 Monsanto Drive',
      city: 'St. Louis',
      state: 'MO',
      zip: '61423',
      primaryPhone: '8471231232',
      secondaryPhone: '314-694-1000',
    };

    const expectedError = {
      name: 'InvalidInputError',
      message: 'The information does not satisfy the requirements.',
      statusCode: 400,
      errorDetails: [
        {
          param: '_error',
          msg: 'Invalid value(s)',
          nestedErrors: [
            {
              location: 'body',
              param: 'federationId',
              value: '',
              msg: 'A value in field federationId is required.',
            },
            {
              location: 'body',
              param: 'lastName',
              value: '',
              msg: 'A value in field lastName is required.',
            },
            {
              location: 'body',
              param: 'locationRoles',
              msg: 'A nonempty array is required for field locationRoles.',
            },
            {
              location: 'body',
              param: 'locationRoles',
              msg: 'A nonempty array is required for field locationRoles.',
            },
            {
              location: 'body',
              param: 'federationId',
              value: '',
              msg: 'A value in field federationId is required.',
            },
            {
              location: 'body',
              param: 'lastName',
              value: '',
              msg: 'A value in field lastName is required.',
            },
            {
              location: 'body',
              param: 'roleIdList',
              value: [
                '',
                '',
              ],
              msg: 'A nonempty array is required for field roleIdList.',
            },
          ],
        },
      ],
    };

    return request(app).post('/v1/users')
      .type('form')
      .send(requestBody)
      .then(response => {
        expect(response.status).toBe(400);
        expect(response.body).toEqual(expectedError);
      });
  });

  it('Empty db results return ResourceNotFoundError at following endpoints', async () => {
    // Need to add testing for neo4j utils
    readTransaction.mockImplementation(() => {
      throw new TypedError(ErrorTypes.RESOURCE_NOT_FOUND, 'No records were returned.');
    });
    const endpoints = [
      '/v1/users/1234/entitlements/myaccount',
      '/v1/users/1234/brands/channel/personas/grower/entitlements',
      '/v1/users/1234/accounts',
      '/v1/users/1234/brands/channel/personas/grower/accounts',
    ];

    const promises = [];
    endpoints.forEach(endpoint => {
      promises.push(request(app).get(endpoint)
        .then(response => {
          expect(response.status).toBe(404);
          expect(response.body.name).toBe('ResourceNotFoundError');
          expect(response.body.message).toBe('No records were returned.');
        }));
    });

    return Promise.all(promises);
  });
});
