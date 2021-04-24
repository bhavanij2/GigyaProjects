import { StatementResult } from 'neo4j-driver/types/v1';
import { readTransaction } from '../../../neo4j.utils';

import { LoginDetails, User } from '../types';
import { getUsersQuery } from '../queries';
import { mapNeo4jStatementResultToLoginDetails } from '../mappers';
import { pendingUsers } from '../users.api.persistence';


const mapPendingUsersToResult = users => users.map(u => ({
  first_name: u.firstName,
  last_name: u.lastName,
  name: u.email,
  id: u.email,
  city: u.city,
  state: u.state,
  status: 'pending',
  lastLogin: '',
  persona: u.userType,
  hqSapId: u.hqSapId,
  primary_phone: u.phone1,
  secondary_phone: u.phone2,
  contact_glopid: '',
  address_line_1: u.address1,
  address_line_2: u.address12,
  federationId: u.email,
  brand: u.brand,
}));

async function getUsersService(
  userConditionals: Partial<User>,
  sapId?: string,
): Promise<LoginDetails[]> {
  const { status } = userConditionals;
  let usersPendingRegistration = [];
  if (!status || status.split(',').includes('pending')) {
    usersPendingRegistration = await pendingUsers({ ...userConditionals, sapId });
  }
  const query = getUsersQuery(userConditionals, sapId);
  const transactionResult: StatementResult = await readTransaction(query);
  const pendingUsersResult = mapPendingUsersToResult(usersPendingRegistration);
  const activeUserResult = mapNeo4jStatementResultToLoginDetails(transactionResult);
  return [...pendingUsersResult, ...activeUserResult];
}

export default getUsersService;
