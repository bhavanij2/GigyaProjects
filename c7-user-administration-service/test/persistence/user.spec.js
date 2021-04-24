import { to } from 'await-to-js';
import { createInternalUser as createUserQuery } from '../../src/server/v1/queries.util';
import { writeTransaction } from '../../src/server/v1/transaction/write';
import { sendAuditMessage } from '../../src/server/sqs.utils';
import * as Test from '../../src/server/v1/persistence/user';

jest.mock('../../src/server/v1/queries.util.js', () => ({
  createInternalUser: jest.fn(),
}));

jest.mock('../../src/server/v1/transaction/write.js', () => ({
  writeTransaction: jest.fn(),
}));

jest.mock('../../src/server/sqs.utils.js', () => ({
  sendAuditMessage: jest.fn(),
}));

let userProfile;

describe('User Persistence', () => {
  beforeEach(() => {
    userProfile = {
      federationId: 'abcd',
      userType: 'dealer',
      email: 'email',
      firstName: 'test',
      lastName: 'test',
    };
  });

  it('returns error when writeTransaction fails', async () => {
    const query = 'query';
    createUserQuery.mockReturnValue(query);
    writeTransaction.mockReturnValue(Promise.reject(new Error('Write Transaction Failed')));
    sendAuditMessage.mockReturnValue();

    const [error] = await to(Test.createInternalUser(userProfile));

    expect(error.message).toBe('Failed to create user; Write Transaction Failed');
    expect(createUserQuery).toBeCalledWith(userProfile);
    expect(writeTransaction).toBeCalledWith(query);
    expect(sendAuditMessage).not.toBeCalled();
  });

  it('returns resolve User Created when write is successful', async () => {
    const change = {
      id: 'email',
      name: 'test test',
      federationId: 'abcd',
      persona: 'dealer',
      internal: true,
    };
    const query = 'query';
    const transactionId = '123';
    createUserQuery.mockReturnValue(query);
    writeTransaction.mockReturnValue(Promise.resolve('success'));
    sendAuditMessage.mockReturnValue();

    const [error, result] = await to(Test.createInternalUser(userProfile, transactionId));

    expect(error).toBeNull();
    expect(result).toBe('User Created');
    expect(createUserQuery).toBeCalledWith(userProfile);
    expect(writeTransaction).toBeCalledWith(query);
    expect(sendAuditMessage).toBeCalledWith('CREATE INTERNAL USER', 'USER', {}, change, '123');
  });
});
