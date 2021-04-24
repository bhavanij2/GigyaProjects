import combineErrors from 'combine-errors';
import { to } from 'await-to-js';
import { WRITE } from 'neo4j-driver/lib/v1/driver';
import { neo4jUtil, closeSessionUtil } from '../neo4j.utils';

export async function writeTransaction(query) {
  return new Promise(async (resolve, reject) => {
    const { driver, session } = neo4jUtil(WRITE);
    const tx = session.beginTransaction();

    const rollback = err => {
      tx.rollback();
      closeSessionUtil(session, driver);
      return reject(combineErrors([new Error('Failed to write to Neo4j'), err]));
    };

    const [runError] = await to(tx.run(query, {}));

    if (runError) return rollback(runError);

    const [commitError] = await to(tx.commit());

    if (commitError) return rollback(commitError);

    closeSessionUtil(session, driver);

    return resolve(true);
  });
}
