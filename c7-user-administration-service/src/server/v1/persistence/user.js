import combineErrors from 'combine-errors';
import Record from 'neo4j-driver/lib/v1/record';
import { to } from 'await-to-js';
import { createInternalUser as createUserQuery, getUser as getUserQuery, updateBrandQuery } from '../queries.util';
import { writeTransaction } from '../transaction/write';
import { readTransaction } from '../transaction/read';
import { sendAuditMessage } from '../../sqs.utils';

export async function createInternalUser(user, transactionId) {
  return new Promise(async (resolve, reject) => {
    const query = createUserQuery(user);
    const [writeError] = await to(writeTransaction(query));

    if (writeError) {
      console.error(writeError);
      return reject(combineErrors([new Error('Failed to create user'), writeError]));
    }

    await sendAuditMessage('CREATE INTERNAL USER', 'USER', {},
      {
        id: user.email,
        name: `${user.firstName} ${user.lastName}`,
        federationId: user.federationId,
        persona: user.userType,
        internal: true,
      }, transactionId);

    return resolve('User Created');
  });
}

export async function getUser(federationId) {
  return new Promise(async (resolve, reject) => {
    const query = getUserQuery(federationId);
    const [readError, result] = await to(readTransaction(query));

    if (readError) {
      console.error(readError);
      return reject(combineErrors([new Error('Failed to get user'), readError]));
    }

    const users = result.records.map(record => {
      const neoRecord = new Record(record.keys, record._fields, record._fieldLookup);
      return neoRecord.get('user');
    });
    return resolve(users.length ? { ...users[0].properties } : undefined);
  });
}

export async function updateUserBrandAndPersona(userProfile, brand, persona, transactionId) {
  return new Promise(async (resolve, reject) => {
    const query = updateBrandQuery(userProfile.federationId, brand, persona);
    const [writeError, result] = await to(writeTransaction(query));

    if (writeError) {
      console.error(writeError);
      return reject(combineErrors([new Error('Failed to update user brand'), writeError]));
    }

    await sendAuditMessage('UPDATE INTERNAL USER', 'USER',
      {
        brand: userProfile.brand,
        persona: userProfile.userType,
      },
      { brand, persona }, transactionId);

    return resolve(result);
  });
}
