import combineErrors from 'combine-errors';
import { zipObject, chain, reduce } from 'lodash';
import { to } from 'await-to-js';
import { readTransaction } from '../transaction/read';
import { getUserEntitlementsQuery } from '../rest/users/users.queries';
import { performance } from 'perf_hooks';

function getPermissionsByAccount(groupedBySapAccountId, key, isShadow) {
  const accountPermissions = reduce(
    groupedBySapAccountId[key],
    (memo, val) => [
      ...memo,
      `${val.pid}:${isShadow ? 'read' : val.permissionType}`,
    ],
    [],
  );
  return {
    sapAccountNumber: key,
    permissions: accountPermissions,
  };
}

function getLocationPermissionsArray(accountsPermissionsArray) {
  return reduce(accountsPermissionsArray,
    (memo, val) => ({
      ...memo,
      [val.sapAccountNumber]: val.permissions,
    }),
    {});
}

export async function fetchEntitlements(user, scopes) {
  return new Promise(async (resolve, reject) => {
    var t0 = performance.now()
    const [error, result] = await to(readTransaction(getUserEntitlementsQuery(user.federationId, scopes)));
    var t1 = performance.now()
    console.log("time to execute entitlements call " + (t1 - t0) + " milliseconds.")
    if (error) {
      return reject(combineErrors([new Error('Failed to read from Neo4j'), error]));
    }
    const arrayGroupedBySapAccountId = chain(result.records)
      .map(record => zipObject(record.keys, record._fields))
      .groupBy('sapAccountId')
      .value();
    const keys = Object.keys(arrayGroupedBySapAccountId);
    const accountsPermissionsArray = keys.map(key => getPermissionsByAccount(arrayGroupedBySapAccountId, key, user.shadow));
    const userEntitlements = { entitlements: getLocationPermissionsArray(accountsPermissionsArray) };
    if (user.shadow) {
      userEntitlements.shadow = {
        federationId: user.federationId,
      };
    }
    return resolve(userEntitlements);
  });
}
