import { to } from 'await-to-js';
import { READ } from 'neo4j-driver/lib/v1/driver';
import { neo4jUtil, closeSessionUtil } from '../../src/server/v1/neo4j.utils';
import * as Test from '../../src/server/v1/transaction/read';

jest.mock('../../src/server/v1/neo4j.utils.js', () => ({
  neo4jUtil: jest.fn(),
  closeSessionUtil: jest.fn(),
}));

const mockSession = () => {
  const session = {};
  session.readTransaction = jest.fn();
  return session;
};

let session;

describe('Read Transaction', () => {
  beforeEach(async () => {
    session = mockSession();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('rolls back when read fails', async () => {
    const query = 'query';
    const driver = 'driver';
    neo4jUtil.mockReturnValue({ driver, session });
    session.readTransaction.mockReturnValue(Promise.reject(new Error('failed')));

    const [error] = await to(Test.readTransaction(query));

    expect(error.message).toBe('Failed to read from Neo4j; failed');
    expect(neo4jUtil).toBeCalledWith(READ);
    expect(closeSessionUtil).toBeCalledWith(session, driver);
  });

  it('closes session and resolves when read is successful', async () => {
    const query = 'query';
    const driver = 'driver';
    neo4jUtil.mockReturnValue({ driver, session });
    session.readTransaction.mockReturnValue(Promise.resolve({ records: ['1', '2'] }));

    const [error, result] = await to(Test.readTransaction(query));

    expect(error).toBeNull();
    expect(result).toBeTruthy();
    expect(result.records.length).toBe(2);
    expect(neo4jUtil).toBeCalledWith(READ);
    expect(closeSessionUtil).toBeCalledWith(session, driver);
  });
});
