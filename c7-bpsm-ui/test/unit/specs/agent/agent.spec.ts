import { getAdminHeaders } from '@/utils/agent';

import {
  getAdminContext,
} from './utils';


describe('agent getAdminHeaders', () => {
  it('is correct for External context', () => {
    const context = getAdminContext('External');
    const headers = getAdminHeaders(context);
    expect(headers.headers.AdminType).toBe('External');
    expect(headers.headers.Authorization).toBe('Bearer extToken');
  });

  it('is correct for Internal context', () => {
    const context = getAdminContext('Internal');
    const headers = getAdminHeaders(context);
    expect(headers.headers.AdminType).toBe('Internal');
    expect(headers.headers.Authorization).toBe('Bearer intToken');
  });
});
