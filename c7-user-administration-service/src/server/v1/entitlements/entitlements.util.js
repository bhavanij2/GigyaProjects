import {
  chain,
  zipObject,
} from 'lodash';
import {
  Neo4jEntityProperties,
  MapToNeo4jObj,
} from '../../util';

export const getExistingSapId = dbResult => chain(dbResult.records)
  .map(record => zipObject(record.keys, record._fields))
  .value();

export const createLocationObj = (sapAccountId, locationInfo) => {
  const createLocationRequestProperties = [
    'sapAccountId',
    'streetAddress',
    'city',
    'state',
    'zipCode',
    'hqSapId',
    'locationName',
  ];
  const neo4jLocationPropertyMap = zipObject(Neo4jEntityProperties.location, createLocationRequestProperties);

  return MapToNeo4jObj(
    neo4jLocationPropertyMap,
    {
      ...locationInfo,
      sapAccountId,
    },
  );
};

export const createUserObj = body => {
  const primaryPhone = body.primaryPhone || '';
  const primaryPhoneType = primaryPhone === '' ? '' : body.primaryPhoneType || 'mobile';
  const secondaryPhone = body.secondaryPhone || '';
  const secondaryPhoneType = secondaryPhone === '' ? '' : body.secondaryPhoneType || 'land';
  const testUser = body.testUser || 'no';
  const country = body.country ? body.country : 'US';
  const portal = body.portal ? body.portal : 'mycrop';

  const createUserRequestProperties = [
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
    'country',
    'portal',
    'primaryPhone',
    'primaryPhoneType',
    'secondaryPhone',
    'secondaryPhoneType',
    'contactGlopid',
    'zip',
    'testUser',
  ];
  const neo4jUserPropertyMap = zipObject(Neo4jEntityProperties.user, createUserRequestProperties);

  return MapToNeo4jObj(
    neo4jUserPropertyMap,
    {
      ...body,
      primaryPhone,
      primaryPhoneType,
      secondaryPhone,
      secondaryPhoneType,
      testUser,
      country,
      portal,
    },
  );
};

export const createUserLocationObj = (body, sapAccountId, locationInfo) => {
  const user = createUserObj(body);
  const location = createLocationObj(sapAccountId, locationInfo);
  return { user, location };
};
