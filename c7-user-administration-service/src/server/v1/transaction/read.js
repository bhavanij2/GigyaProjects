import combineErrors from 'combine-errors';
import { to } from 'await-to-js';
import { READ } from 'neo4j-driver/lib/v1/driver';
import { neo4jUtil, closeSessionUtil } from '../neo4j.utils';

export async function readTransaction(query) {
  return new Promise(async (resolve, reject) => {
    const { driver, session } = neo4jUtil(READ);

    const rollback = err => {
      closeSessionUtil(session, driver);
      return reject(combineErrors([new Error('Failed to read from Neo4j'), err]));
    };

    const [error, result] = await to(session.readTransaction(tx => tx.run(query, {})));

    if (error) return rollback(error);

    closeSessionUtil(session, driver);

    return resolve(result);
  });
}
