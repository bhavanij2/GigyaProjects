import { to } from 'await-to-js';
import combineErrors from 'combine-errors';
import { chain, zipObject } from 'lodash';
import { getUserAccountsQuery } from '../rest/users/users.queries';
import { readTransaction } from '../transaction/read';

const brandsMap = {
  national: 'NB',
  channel: 'CB',
  fontinelle: 'Fontinelle'
};
function processAccounts(accounts) {
  const processed = chain(accounts.records)
    .map(record => zipObject(record.keys, record._fields))
    .uniqBy(record => record.sapAccountId)
    .value();
  const user = {
    userName: processed[0].userName,
    userId: processed[0].userId,
    uid: processed[0].contactGlopid,
    glopid: processed[0].contactGlopid,
    userType: processed[0].persona.toUpperCase(),
    mimeType: 'image/jpeg',
    federationId: processed[0].uid,
    contactSfdcId: processed[0].contactSfdcId || '',
    firstName: processed[0].firstName || '',
    lastName: processed[0].lastName || '',
    primaryPhone: processed[0].primaryPhone || '',
    secondaryPhone: processed[0].secondaryPhone || '',
    secondaryPhoneType: processed[0].secondaryPhoneType || '',
    primaryPhoneType: processed[0].primaryPhoneType || '',
    addressLine1: processed[0].addressLine1 || '',
    addressLine2: processed[0].addressLine2 || '',
    city: processed[0].userCity || '',
    state: processed[0].userState || '',
    zipCode: processed[0].zipCode || '',
  };
  const processedAccounts = chain(processed)
    .map(account => ({
      sapAccountId: account.sapAccountId,
      city: account.city,
      state: account.state,
      accountName: account.accountName,
      uid: account.sapAccountId,
      brands: [brandsMap[account.brand]],
      sourceSystem: account.sourceSystem,
    }))
    .value();
  return {
    ...user,
    accounts: processedAccounts,
  };
}

export async function fetchUserWithAccountsByFederationId(user, scopes) {
  return new Promise(async (resolve, reject) => {

    const [error, userWithAccounts] = await to(readTransaction(getUserAccountsQuery(user.federationId, scopes)));
    if (error) {
      return reject(combineErrors([new Error('Failed to read accounts data from Neo4j'), error]));
    }
    const processedAccounts = processAccounts(userWithAccounts);
    if (user.shadow) {
      processedAccounts.shadow = {
        federationId: user.federationId,
      };
    }
    return resolve(processedAccounts);
  });
}
