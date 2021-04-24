import AWS from 'aws-sdk';
import {
  getEntitlementsFromRole,
  getRolesFromEntitlement,
} from '../../src/server/v1/middleware/internal-authorization/velocity-mappings';
import dynamoDocClient from '../../src/server/v1/dynamo.util';

jest.mock('../../src/server/v1/dynamo.util.js');
jest.mock('aws-sdk');

const mockDynamoDocClient = {
  scan: () => ({
    promise: () => ({
      Items: [
        {
          velocityEntitlementCode: 'internal-user-admin',
          c7RoleId: 'glb:int-ua:ad',
        },
      ],
    }),
  }),
};

describe('velocity mappings', () => {
  AWS.config.update.mockReturnValue(null);

  it('throws an error when requests to dynamo fail to retrieve roles', async () => {
    await expect(getRolesFromEntitlement('internal-user-admin')).rejects.toThrow();
  });

  it('throws an error when requests to dynamo fail to retrieve entitlements', async () => {
    await expect(getEntitlementsFromRole('glb:int-ua:ad')).rejects.toThrow();
  });

  it('returns an array of the mapped roles with a valid velocityEntitlement', async () => {
    dynamoDocClient.mockReturnValue(mockDynamoDocClient);
    const roles = await getRolesFromEntitlement('internal-user-admin', dynamoDocClient());
    expect(roles.length).toBe(1);
    expect(roles[0]).toBe('glb:int-ua:ad');
  });

  it('returns an array of the mapped entitlements with a valid c7-role id', async () => {
    dynamoDocClient.mockReturnValue(mockDynamoDocClient);
    const entitlements = await getEntitlementsFromRole('glb:int-ua:ad', dynamoDocClient());
    expect(entitlements.length).toBe(1);
    expect(entitlements[0]).toBe('internal-user-admin');
  });
});
