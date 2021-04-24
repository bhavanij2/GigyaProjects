import { LOB } from '../types';

export { ErrorResponse, SuccessResponse, LOB } from '../types';

export interface CreatePermissionBody {
  id: string;
  action: string;
  lob: LOB;
  application: string;
  description: string;
  type: PermissionType;
}

export enum PermissionType {
  leftNav = 'leftNav',
  widget = 'widget',
}
