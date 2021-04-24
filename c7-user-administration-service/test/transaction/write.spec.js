import { to } from 'await-to-js';
import { WRITE } from 'neo4j-driver/lib/v1/driver';
import { neo4jUtil, closeSessionUtil } from '../../src/server/v1/neo4j.utils';
import * as Test from '../../src/server/v1/transaction/write';

jest.mock('../../src/server/v1/neo4j.utils.js', () => ({
  neo4jUtil: jest.fn(),
  closeSessionUtil: jest.fn(),
}));

const mockTransaction = () => {
  const transaction = {};
  transaction.rollback = jest.fn();
  transaction.run = jest.fn();
  transaction.commit = jest.fn();
  return transaction;
};

const mockSession = () => {
  const session = {};
  session.beginTransaction = jest.fn();
  return session;
};

let session;
let transaction;

describe('Write Transaction', () => {
  beforeEach(async () => {
    transaction = mockTransaction();
    session = mockSession();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('rolls back when write transaction fails', async () => {
    const query = 'query';
    const driver = 'driver';
    neo4jUtil.mockReturnValue({ driver, session });
    session.beginTransaction.mockReturnValue(transaction);
    transaction.run.mockReturnValue(Promise.reject(new Error('failed')));

    const [error] = await to(Test.writeTransaction(query));

    expect(error.message).toBe('Failed to write to Neo4j; failed');
    expect(neo4jUtil).toBeCalledWith(WRITE);
    expect(transaction.run).toBeCalledWith(query, {});
    expect(transaction.rollback).toBeCalled();
    expect(closeSessionUtil).toBeCalledWith(session, driver);
  });

  it('rolls back when commit transaction fails', async () => {
    const query = 'query';
    const driver = 'driver';
    neo4jUtil.mockReturnValue({ driver, session });
    session.beginTransaction.mockReturnValue(transaction);
    transaction.run.mockReturnValue(Promise.resolve('success'));
    transaction.commit.mockReturnValue(Promise.reject(new Error('failed')));

    const [error] = await to(Test.writeTransaction(query));

    expect(error.message).toBe('Failed to write to Neo4j; failed');
    expect(neo4jUtil).toBeCalledWith(WRITE);
    expect(transaction.run).toBeCalledWith(query, {});
    expect(transaction.commit).toBeCalled();
    expect(transaction.rollback).toBeCalled();
    expect(closeSessionUtil).toBeCalledWith(session, driver);
  });

  it('closes session and resolves when commit is successful', async () => {
    const query = 'query';
    const driver = 'driver';
    neo4jUtil.mockReturnValue({ driver, session });
    session.beginTransaction.mockReturnValue(transaction);
    transaction.run.mockReturnValue(Promise.resolve('success'));
    transaction.commit.mockReturnValue(Promise.resolve('success'));

    const [error, result] = await to(Test.writeTransaction(query));

    expect(error).toBeNull();
    expect(result).toBeTruthy();
    expect(neo4jUtil).toBeCalledWith(WRITE);
    expect(transaction.run).toBeCalledWith(query, {});
    expect(transaction.commit).toBeCalled();
    expect(transaction.rollback).not.toBeCalled();
    expect(closeSessionUtil).toBeCalledWith(session, driver);
  });
});
