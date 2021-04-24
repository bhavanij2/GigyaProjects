import { readTransaction } from '../../../neo4j.utils';
import { getPermissionsQuery } from '../queries';
import { VelocityGroup } from '../types';

async function getPermissionService(groups: VelocityGroup[]) {
  const transactionResult = await readTransaction(getPermissionsQuery(groups));
  return transactionResult;
}

export default getPermissionService;
