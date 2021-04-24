import { zipObject } from 'lodash';
import {
  Neo4jEntityProperties,
  MapToNeo4jObj,
} from '../../src/server/util';

it('MapToNeo4jObj creates object with all neo4j properties given any js obj', () => {
  const allPossibleCreateUserRequestProperties = [
    'userId',
    'userName',
    'hqSapId',
    'federationId',
    'brand',
    'persona',
    'firstName',
    'lastName',
    'addressLine1',
    'addressLine2',
    'city',
    'state',
    'primaryPhone',
    'primaryPhoneType',
    'secondaryPhone',
    'secondaryPhoneType',
    'contactGlopid',
    'zip',
    'testUser',
  ];

  const createUserRequestBody = {
    userId: 'jsmith@gmail.com',
    firstName: 'john',
    lastName: 'smith',
    userName: 'John Smith',
    roleId: 'glb:*:dealer',
    sapAccountId: '123456',
    brand: 'NB',
    persona: 'dealer',
    portal: '',
    federationId: '1234-5678-9876',
    addressLine1: null,
    addressLine2: undefined,
  };

  const expected = {
    id: createUserRequestBody.userId,
    name: createUserRequestBody.userName,
    hqSapId: '',
    federationId: createUserRequestBody.federationId,
    brand: createUserRequestBody.brand,
    persona: createUserRequestBody.persona,
    portal: '',
    first_name: createUserRequestBody.firstName,
    last_name: createUserRequestBody.lastName,
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    primary_phone: '',
    primary_phone_type: '',
    secondary_phone: '',
    secondary_phone_type: '',
    contact_glopid: '',
    zipCode: '',
    testUser: '',
    country: '',
    portal: ''
  };

  const userPropertyMap = zipObject(Neo4jEntityProperties.user, allPossibleCreateUserRequestProperties);

  const result = MapToNeo4jObj(
    userPropertyMap,
    createUserRequestBody,
  );

  expect(result).toEqual(expected);
});
