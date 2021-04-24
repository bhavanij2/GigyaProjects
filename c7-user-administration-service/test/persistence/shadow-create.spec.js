import { to } from 'await-to-js';
import { createShadowRelationshipQuery } from '../../src/server/v1/queries.util';
import { writeTransaction } from '../../src/server/v1/transaction/write';
import { sendAuditMessage } from '../../src/server/sqs.utils';
import * as Test from '../../src/server/v1/persistence/shadow';

jest.mock('../../src/server/v1/queries.util.js', () => ({
  createShadowRelationshipQuery: jest.fn(),
}));

jest.mock('../../src/server/v1/transaction/write.js', () => ({
  writeTransaction: jest.fn(),
}));

jest.mock('../../src/server/sqs.utils.js', () => ({
  sendAuditMessage: jest.fn(),
}));

describe('Shadow Create Persistence', () => {
  it('returns error when writeTransaction fails', async () => {
    const shadowerFederationId = 'abcd';
    const shadowedFederationId = 'diana';
    const query = 'query';
    createShadowRelationshipQuery.mockReturnValue(query);
    writeTransaction.mockReturnValue(Promise.reject(new Error('Write Transaction Failed')));
    sendAuditMessage.mockReturnValue();

    const [error] = await to(Test.createShadowRelationship(shadowerFederationId, shadowedFederationId));

    expect(error.message).toBe('Failed to create shadow relationship; Write Transaction Failed');
    expect(createShadowRelationshipQuery).toBeCalledWith(shadowerFederationId, shadowedFederationId);
    expect(writeTransaction).toBeCalledWith(query);
    expect(sendAuditMessage).not.toBeCalled();
  });

  it('returns resolve Shadow relationship created when write is successful', async () => {
    const shadowerFederationId = 'abcd';
    const shadowedFederationId = 'diana';
    const change = {
      federationIdOfShadower: 'abcd',
      federationIdOfShadowee: 'diana',
    };
    const query = 'query';
    const transactionId = '123';
    createShadowRelationshipQuery.mockReturnValue(query);
    writeTransaction.mockReturnValue(Promise.resolve('success'));
    sendAuditMessage.mockReturnValue();

    const [error, result] = await to(Test.createShadowRelationship(shadowerFederationId, shadowedFederationId, transactionId));

    expect(error).toBeNull();
    expect(result).toBe('Shadow Relationship Created');
    expect(createShadowRelationshipQuery).toBeCalledWith(shadowerFederationId, shadowedFederationId);
    expect(writeTransaction).toBeCalledWith(query);
    expect(sendAuditMessage).toBeCalledWith('CREATE RELATIONSHIP', 'SHADOW', {}, change, '123');
  });
});
