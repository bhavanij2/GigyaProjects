import { ErrorTypes, TypedError } from '../../../errors';

const queryDynamo = async (params, dynamoDocClient, field) => {
  try {
    const response = await dynamoDocClient.scan(params).promise();

    if (Array.isArray(response.Items) && response.Items.length) {
      return response.Items.map(mapping => mapping[field]);
    }

    return [];
  }
  catch (error) {
    throw new TypedError(
      ErrorTypes.INTERNAL_SERVER_ERROR,
      `Failed to read from DynamoDb table: ${params.TableName}`,
      [error.stack],
    );
  }
};

export const getEntitlementsFromRole = async (c7RoleId, dynamoDocClient) => {
  const params = {
    TableName: 'acs2-c7-ua-roles-entitlements',
    FilterExpression: 'c7RoleId = :c',
    ExpressionAttributeValues: {
      ':c': c7RoleId,
    },
  };

  return queryDynamo(params, dynamoDocClient, 'velocityEntitlementCode');
};

export const getRolesFromEntitlement = async (velocityEntitlement, dynamoDocClient) => {
  const params = {
    TableName: 'acs2-c7-ua-roles-entitlements',
    FilterExpression: 'velocityEntitlementCode = :v',
    ExpressionAttributeValues: {
      ':v': velocityEntitlement,
    },
  };

  return queryDynamo(params, dynamoDocClient, 'c7RoleId');
};

export default {
  getEntitlementsFromRole,
  getRolesFromEntitlement,
};
