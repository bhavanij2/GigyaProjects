import {
  READ,
  WRITE,
} from 'neo4j-driver/lib/v1/driver';
import {
  ErrorTypes,
  TypedError,
} from '../errors';

const neo4j = require('neo4j-driver').v1;

export const neo4jUtil = mode => {
  const driver = neo4j.driver(process.env.neo4j_host_url, neo4j.auth.basic(process.env.username, process.env.password));
  const session = driver.session(mode);
  return { driver, session };
};

export const closeSessionUtil = (session, driver) => {
  session.close();
  driver.close();
};

export const writeTransaction = async (getQuery, variables) => {
  const { driver, session } = neo4jUtil(WRITE);
  const tx = session.beginTransaction();
  try {
    const query = getQuery(variables);
    await tx.run(query, {});
    await tx.commit();
    closeSessionUtil(session, driver);
    return 'SUCCESS';
  }
  catch (error) {
    tx.rollback();
    closeSessionUtil(session, driver);
    throw new TypedError(ErrorTypes.NEO4J_WRITE_TRANSACTION_ERROR, 'Failed to write to Neo4j.', [error.stack]);
  }
};

export const writeTransactionReturnResult = async (getQuery, variables) => {
  const { driver, session } = neo4jUtil(WRITE);
  const tx = session.beginTransaction();
  try {
    const query = getQuery(variables);
    const result = await tx.run(query, {});
    await tx.commit();
    closeSessionUtil(session, driver);
    return result.summary;
  }
  catch (error) {
    tx.rollback();
    closeSessionUtil(session, driver);
    throw new TypedError(ErrorTypes.NEO4J_WRITE_TRANSACTION_ERROR, 'Failed to write to Neo4j.', [error.stack]);
  }
};

export const writeListTransaction = async (getQuery, variables, list) => {
  console.log('--GET-QUERY--', getQuery);
  console.log('--VARIABLES--', variables);
  console.log('--LIST--', list);
  const { driver, session } = neo4jUtil(WRITE);
  const tx = session.beginTransaction();
  try {
    await Promise.all(list.map(async item => {
      const query = getQuery(variables, item);
      return tx.run(query, {});
    }));
    await tx.commit();
    closeSessionUtil(session, driver);
    return 'SUCCESS';
  }
  catch (error) {
    tx.rollback();
    closeSessionUtil(session, driver);
    throw new TypedError(ErrorTypes.NEO4J_WRITE_TRANSACTION_ERROR, 'Failed to write to Neo4j.', [error.stack]);
  }
};

export const readTransaction = async (query, { required = false } = {}) => {
  const { driver, session } = neo4jUtil(READ);
  try {
    console.log(query);
    const result = await session.readTransaction(tx => tx.run(query, {}));
    closeSessionUtil(session, driver);
    if (required && !result.records.length) {
      throw new TypedError(ErrorTypes.RESOURCE_NOT_FOUND, 'No records were returned.');
    }
    return result;
  }
  catch (error) {
    closeSessionUtil(session, driver);
    throw new TypedError(ErrorTypes.NEO4J_ERROR, 'Failed to read from Neo4j.', [error.stack]);
  }
};
