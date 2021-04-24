import { to } from 'await-to-js';
import { deleteShadowRelationshipQuery } from '../../src/server/v1/queries.util';
import { writeTransaction } from '../../src/server/v1/transaction/write';
import { sendAuditMessage } from '../../src/server/sqs.utils';
import * as Test from '../../src/server/v1/persistence/shadow';

jest.mock('../../src/server/v1/queries.util.js', () => ({
  deleteShadowRelationshipQuery: jest.fn(),
}));

jest.mock('../../src/server/v1/transaction/write.js', () => ({
  writeTransaction: jest.fn(),
}));

jest.mock('../../src/server/sqs.utils.js', () => ({
  sendAuditMessage: jest.fn(),
}));

describe('Shadow Delete Persistence', () => {
  it('returns error when writeTransaction fails', async () => {
    const federationId = 'abcd';
    const query = 'query';
    deleteShadowRelationshipQuery.mockReturnValue(query);
    writeTransaction.mockReturnValue(Promise.reject(new Error('Write Transaction Failed')));
    sendAuditMessage.mockReturnValue();

    const [error] = await to(Test.deleteShadowRelationship(federationId));

    expect(error.message).toBe('Failed to delete shadow relationship; Write Transaction Failed');
    expect(deleteShadowRelationshipQuery).toBeCalledWith(federationId);
    expect(writeTransaction).toBeCalledWith(query);
    expect(sendAuditMessage).not.toBeCalled();
  });

  it('returns resolve Shadow relationship created when write is successful', async () => {
    const federationIdOfShadower = 'abcd';
    const query = 'query';
    const transactionId = '123';
    deleteShadowRelationshipQuery.mockReturnValue(query);
    writeTransaction.mockReturnValue(Promise.resolve('success'));
    sendAuditMessage.mockReturnValue();

    const [error, result] = await to(Test.deleteShadowRelationship(federationIdOfShadower, transactionId));

    expect(error).toBeNull();
    expect(result).toBe('Shadow Relationship Deleted');
    expect(deleteShadowRelationshipQuery).toBeCalledWith(federationIdOfShadower);
    expect(writeTransaction).toBeCalledWith(query);
    expect(sendAuditMessage).toBeCalledWith('DELETE RELATIONSHIP', 'SHADOW', { federationIdOfShadower }, {}, '123');
  });
});
