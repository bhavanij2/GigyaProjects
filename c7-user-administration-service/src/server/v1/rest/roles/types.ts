import { Brand, Persona } from '../users/types';
export { ErrorResponse, SuccessResponse } from '../types';

export interface AddRoleRequestBody {
  id: string;
  name: string;
  lob: string;
  brand: Brand;
  persona: Persona;
  country: string;
  scope: string;
  description: string;
  longDescription: string;
  beta: boolean;
  internal: boolean;
}

export interface PartialRole {
  newRoleId?: string;
  name?: string;
  lob?: string;
  brand?: Brand;
  persona?: Persona;
  country?: string;
  scope?: string;
  description?: string;
  longDescription?: string;
  beta?: boolean;
  internal?: boolean;
}

export interface UpdateRoleRequestBody {
  newRoleId?: string,
  role?: AddRoleRequestBody,
}

export interface GetRolesParameters {
  brand: Brand;
  persona: Persona;
  country: string;
}

export interface PermissionBody {
  permissions: PermissionRole[];
}

export interface PermissionRole {
   id: string;
   type: string;
}
