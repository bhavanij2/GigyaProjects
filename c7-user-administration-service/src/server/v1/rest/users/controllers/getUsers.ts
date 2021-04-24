import { User } from '../types';
import { getUsersService } from '../services';

async function getUsers(userData, locData): Promise<User[]> {
  const result = await getUsersService(userData, locData);
  return result;
};

export default getUsers;