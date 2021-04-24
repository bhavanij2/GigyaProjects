import { Node } from 'neo4j-driver/types/v1';
import { LoginDetails } from './users/types';

export interface Location {
  zipCode: string;
  streetAddress: string;
  city: string;
  name: string;
  state: string;
  sapid: string;
  hqSapId: string;
}

export interface Permission {
  action: string;
  id: string;
  application: string;
  lob: string;
}

export interface Role {
  name: string;
  id: string;
  lob: string;
  scope: string;
}


export enum LOB {
  Acceleron = 'acceleron',
  BioEnhancers = 'bioag',
  CropProtection = 'cp',
  Licensee = 'lic',
  Seed = 'seed',
}


export enum Brand {
  Bayer = 'bayer',
  Channel = 'channel',
  National = 'national',
  Fontanelle = 'fontanelle',
  Goldcountry = 'goldcountry',
  Hubner = 'hubner',
  Jung = 'jung',
  Kruger = 'kruger',
  Lewis = 'lewis',
  Rea = 'rea',
  Specialty = 'specialty',
  Stewart = 'stewart',
  Stone = 'stone',
}

export enum Persona {
  Dealer = 'dealer',
  Grower = 'grower',
  Any = '*',
}

export interface UserProfileHeader {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  partyId: string;
}

export interface Neo4jEntityResultOptions {
  user?: Neo4jUserResultNode;
  location?: Neo4jLocationResultNode;
  permission?: Neo4jPermissionResultNode;
  role?: Neo4jRoleResultNode;
}

export interface SuccessResponse {
  status: string;
  message: string;
}

export interface ErrorResponse {
  name: string;
  message: string;
  statusCode: string;
  errorDetails: string;
}

export interface Neo4jUserResultNode extends Node {
  properties: LoginDetails;
}

export interface Neo4jLocationResultNode extends Node {
  properties: Location;
}

export interface Neo4jPermissionResultNode extends Node {
  properties: Permission;
}

export interface Neo4jRoleResultNode extends Node {
  properties: Role;
}

export interface QueryTypeMap {
  type: string;
  values: string[];
}

export interface PortalParameters {
  country: string;
  brand: string;
  persona: string;
  lob?: LOBData[];
  salesOrganizationCodes?: string[];
  distributionChannelCodes?: string[];
  siteConfiguration?: string;
  lobRecordName: string;
}

export interface LOBData {
  code: string;
  name: string;
}