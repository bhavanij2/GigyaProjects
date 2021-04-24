import combineErrors from 'combine-errors';
import Record from 'neo4j-driver/lib/v1/record';
import { to } from 'await-to-js';
import { createShadowRelationshipQuery, deleteShadowRelationshipQuery, getShadowedUser } from '../queries.util';
import { writeTransaction } from '../transaction/write';
import { readTransaction } from '../transaction/read';
import { sendAuditMessage } from '../../sqs.utils';

export async function createShadowRelationship(federationIdOfShadower, federationIdOfShadowee, transactionId) {
  return new Promise(async (resolve, reject) => {
    const query = createShadowRelationshipQuery(federationIdOfShadower, federationIdOfShadowee);
    const [writeError] = await to(writeTransaction(query));

    if (writeError) {
      console.error(writeError);
      return reject(combineErrors([new Error('Failed to create shadow relationship'), writeError]));
    }

    await sendAuditMessage('CREATE RELATIONSHIP', 'SHADOW', {},
      { federationIdOfShadower, federationIdOfShadowee }, transactionId);

    return resolve('Shadow Relationship Created');
  });
}

export async function deleteShadowRelationship(federationIdOfShadower, transactionId) {
  return new Promise(async (resolve, reject) => {
    const query = deleteShadowRelationshipQuery(federationIdOfShadower);
    const [writeError] = await to(writeTransaction(query));

    if (writeError) {
      console.error(writeError);
      return reject(combineErrors([new Error('Failed to delete shadow relationship'), writeError]));
    }

    await sendAuditMessage('DELETE RELATIONSHIP', 'SHADOW', { federationIdOfShadower }, {}, transactionId);

    return resolve('Shadow Relationship Deleted');
  });
}

export async function getFederationId(federationId) {
  return new Promise(async (resolve, reject) => {
    const query = getShadowedUser(federationId);
    const [readError, result] = await to(readTransaction(query));

    if (readError) {
      console.log(readError);
      return reject(combineErrors([new Error('Failed to read federationId')]));
    }
    if (result.records.length === 0) return resolve({ federationId, shadow: false });
    const federationIds = result.records.map(record => {
      const neoRecord = new Record(record.keys, record._fields, record._fieldLookup);
      return neoRecord.get('u.federationId');
    });
    return resolve({ federationId: federationIds[0], shadow: true });
  });
}
