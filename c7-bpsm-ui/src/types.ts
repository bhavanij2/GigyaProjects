import { EnvironmentName, UserType, Brand, Persona } from '@monsantoit/c7-elements/dist/types/types';

export type EnvironmentName = EnvironmentName;

export interface UserAdminRootState {
  adminLocations: AdminLocationData[];
  adminRoles: any;
  adminType: AdminType;
  companyHqs: any;
  companyLocations: LocationData[];
  entitlements: any;
  externalToken: string;
  hqSapId: string;
  internalEntitlements: InternalEntitlements[];
  internalToken: string;
  roleControl: RoleControlData;
  rolesTableLoading: boolean;
  selectedHq: LocationData;
  userProfile: UserProfile;
  userSearchResults: UserSearchResult[];
  errorMessageOpen: boolean;
}

export type VariadicCallbackFunction = (...args: any[]) => void;
export type APIService = 'useradmin' | undefined;
export type APIPersona = 'internal' | 'dealer' | undefined;
export type AdminType = 'Internal' | 'External' | 'Unknown';
export type RoleControlContext = 'edit' | 'add' | 'delete';
export type LocationLevel = 'HQ' | 'Region' | 'Division' | 'Location';
export type LineOfBusiness = 'seed' | 'cp' | 'acceleron' | 'bioag';
export enum SearchMethod {
  EMAIL = 'email',
  SAP_ID = 'sapId',
  COMPANY_HQ = 'companyHq',
};

// = 'email' | 'sapId' | 'companyHq' | undefined;

export interface InternalEntitlements {
  code: string;
}

export interface RoleControlData {
  context: RoleControlContext;
  open: boolean;
  role: RoleData;
}

export interface RoleData {
  roleName: string;
  lob: string;
  location: LocationData;
}

export interface AdminEnvironmentOptions {
  userType?: UserType;
  brand?: Brand;
  env: EnvironmentName;
}

export interface UserRequestOptions extends AdminEnvironmentOptions {
  fedId: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  state: string;
  location: string;
  sapId: string;
  companyHq: string;
}

export interface UserProfileRequestOptions extends AdminEnvironmentOptions {
  fedId: string;
}

export interface LocationRequestOptions extends AdminEnvironmentOptions {
  locationId: string;
}

export interface NewUserRequestOptions extends AdminEnvironmentOptions {
  userType: UserType;
  userId: string;
}

export interface UserSearchResult {
  zipCode?: string,
  persona?: string,
  city?: string,
  last_name?: string,
  contactSfdcId?: string,
  primary_phone?: string,
  hqSapId?: string,
  primary_phone_type?: string,
  contact_sfdc_id?: string,
  secondary_phone?: string,
  secondary_phone_type?: string,
  contact_glopid?: string,
  address_line_1?: string,
  name?: string,
  state?: string,
  address_line_2?: string,
  id?: string,
  federationId?: string,
  brand?: string,
  first_name?: string
}

/*
 * Location Data for Entire Company
 * No Info on LOB or heirarchy
 */
export interface LocationData {
  accountName?: string;
  sapAccountId?: string;
  name: string;
  id: string;
}

/*
 * Location Data to describe admin
 * rights and permissions. Includes
 * LOB and heirarchy
 */
export interface AdminLocationData extends LocationData {
  level: LocationLevel;
  lob: LineOfBusiness[];
  parentId: string;
}

export interface UserProfile {
  profile: Profile;
  locations: object;
}

export interface Profile {
  address_line_1?: string;
  address_line_2?: string;
  brand?: string;
  city?: string;
  contact_glopid?: string;
  federationId?: string;
  first_name?: string;
  hqSapId?: string;
  id?: string;
  lastLogin?: string;
  last_name?: string;
  name?: string;
  persona?: string;
  primary_phone?: string;
  secondary_phone?: string;
  state?: string;
  status?: string;
  zipCode?: string;

}

// todo: explicit typed strings
export interface RegistrationOptions {
  hqSapId: string;
  brand: string;
  userType: string;
  email: string;
  env: EnvironmentName;
  firstName: string;
  lastName: string;
  locationRoles: LocationRole[];
  sapLocationName: string,
  sapLocationCity: string,
  sapLocationState: string,
}

export interface LocationRole {
  location: RegistrationLocation;
  role: RegistrationRole;
}

// todo: align location & role data formats
interface RegistrationLocation {
  sapId: string;
  hqSapId: string;
}

interface RegistrationRole {
  id: string;
}

export interface AddUserRole {
  brand: Brand;
  country: string;
  lob: LineOfBusiness;
  lobName: string;
  location: AddUserLocation;
  locationName: string;
  persona: Persona;
  name: string;
}

export interface UserSearchGridModel {
  rows: UserSearchGridRow[];
}

export interface UserSearchGridRow {
  className: string;
  cols: UserSearchGridCol[];
}

export interface UserSearchGridCol {
  type: UserSearchGridColType,
  phoneCol: number;
  tabletCol: number;
  desktopCol: number;
  field: UserSearchField;
}

export interface UserSearchGridReferenceDataCol extends UserSearchGridCol {
  disabled: boolean;
  showLoadingIndicatorWhenDisabled: boolean;
}

export type UserSearchGridColType = 'textField' | 'dropdown' | 'select' | 'email';

export interface UserSearchField {
  class: string;
  dataType: string;
}

export interface UserSearchOptionsField extends UserSearchField {
  options: string[];
}

interface AddUserLocation {
  name: string;
  sapid: string;
}

export interface AdminHeaders {
  headers: {
    AdminType: string,
    Authorization: string
  }
}

export interface AdminContext {
  adminType: AdminType;
  externalToken : string;
  internalToken: string;
}

export interface AdminRolesRequestOptions extends AdminEnvironmentOptions {
  beta: boolean;
  brand: Brand;
  country: string
  persona: Persona;
  lob: LineOfBusiness;
}