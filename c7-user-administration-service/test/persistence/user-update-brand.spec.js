import { to } from 'await-to-js';
import { updateBrandQuery } from '../../src/server/v1/queries.util';
import { writeTransaction } from '../../src/server/v1/transaction/write';
import { sendAuditMessage } from '../../src/server/sqs.utils';
import * as Test from '../../src/server/v1/persistence/user';

jest.mock('../../src/server/v1/queries.util.js', () => ({
  updateBrandQuery: jest.fn(),
}));

jest.mock('../../src/server/v1/transaction/write.js', () => ({
  writeTransaction: jest.fn(),
}));

jest.mock('../../src/server/sqs.utils.js', () => ({
  sendAuditMessage: jest.fn(),
}));

let userProfile;

describe('User updateUserBrandAndPersona Persistence', () => {
  beforeEach(() => {
    userProfile = {
      federationId: 'abcd',
      brand: 'channel',
      userType: 'dealer',
    };
  });

  it('returns error when writeTransaction fails', async () => {
    const federationId = 'abcd';
    const brand = 'national';
    const persona = 'dealer';
    const query = 'query';
    updateBrandQuery.mockReturnValue(query);
    writeTransaction.mockReturnValue(Promise.reject(new Error('Write Transaction Failed')));
    sendAuditMessage.mockReturnValue();

    const [error] = await to(Test.updateUserBrandAndPersona(userProfile, brand, persona));

    expect(error.message).toBe('Failed to update user brand; Write Transaction Failed');
    expect(updateBrandQuery).toBeCalledWith(federationId, brand, persona);
    expect(writeTransaction).toBeCalledWith(query);
    expect(sendAuditMessage).not.toBeCalled();
  });

  it('returns resolve User Created when write is successful', async () => {
    const from = {
      brand: 'channel',
      persona: 'dealer',
    };
    const change = {
      brand: 'national',
      persona: 'dealer',
    };
    const federationId = 'abcd';
    const brand = 'national';
    const persona = 'dealer';
    const query = 'query';
    const transactionId = '123';
    updateBrandQuery.mockReturnValue(query);
    writeTransaction.mockReturnValue(Promise.resolve({ records: [] }));
    sendAuditMessage.mockReturnValue();

    const [error, result] = await to(Test.updateUserBrandAndPersona(userProfile, brand, persona, transactionId));

    expect(error).toBeNull();
    expect(result).toMatchObject({ records: [] });
    expect(updateBrandQuery).toBeCalledWith(federationId, brand, persona);
    expect(writeTransaction).toBeCalledWith(query);
    expect(sendAuditMessage).toBeCalledWith('UPDATE INTERNAL USER', 'USER', from, change, transactionId);
  });
});
