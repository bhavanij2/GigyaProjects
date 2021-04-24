import { getAccountsByFedIdService } from '../users.persistence';
import { UserAccountsResponse } from '../types';

async function getUserAccountsByFedId(federationId: string): Promise<UserAccountsResponse> {
  return getAccountsByFedIdService(federationId);
}

export default getUserAccountsByFedId;
