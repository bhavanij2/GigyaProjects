import { getUserInfoService } from '../users.persistence';
import { UserInfoResponse } from '../types';

async function getUserInfo(federationId: string): Promise<UserInfoResponse> {
  return getUserInfoService(federationId);
}

export default getUserInfo;
