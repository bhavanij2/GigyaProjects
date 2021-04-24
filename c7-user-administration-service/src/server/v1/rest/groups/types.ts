import { Brand, Persona } from '../types';

export { ErrorResponse, SuccessResponse, LOB } from '../types';

export enum Access {
  Read = 'read',
  Write = 'write'
}

export interface VelocityGroup {
  id: string;
}

export interface VelocityPermissionRecord {
  id?: string;
  permissions?: string[];
  brand?: Brand;
  country?: string;
  persona?: Persona;
  access?: Access;
}

export interface VelocityPermissions {
  [countryCode: string]: CountryPermissions;
}

interface CountryPermissions {
  [brand: string]: BrandPermissions;
}

interface BrandPermissions {
  [persona: string]: string[];
}