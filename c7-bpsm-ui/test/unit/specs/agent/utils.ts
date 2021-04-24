import {
  AdminContext,
  AdminType,
} from '@/types';

export function getAdminContext(adminType: AdminType) {
  const context: AdminContext = {
    adminType,
    externalToken: 'extToken',
    internalToken: 'intToken',
  };
  return context;
 }


