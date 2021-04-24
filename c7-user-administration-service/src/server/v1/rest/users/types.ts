import { Brand, Persona, Location, Role } from '../types';
export { Brand, Persona } from '../types';

export interface User {
  id: string;
  name: string;
  federationId: string;
  brand: Brand;
  persona: Persona;
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  zipCode: string;
  hqSapId: string;
  primary_phone: string;
  secondary_phone: string;
  status: string;
}

export interface UserAccountsResponse {
  userName: string;
  uid: string;
  glopid: string;
  userType: Persona;
  mimeType: string;
  federationId: string;
  contactSfdcId: string;
  firstName: string;
  lastName: string;
  primaryPhone: string;
  secondaryPhone: string;
  primaryPhoneType: string;
  secondaryPhoneType: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  status: string;
  zipCode: string;
  accounts: Account[];
}

export interface Account {
  sapAccountId: string;
  city: string;
  state: string;
  accountName: string;
  uid: string;
  brands: string[];
}

export interface UserEntitlementsResponse {
  [sapId: string]: string[];
}

export interface UserInfoResponse {
  profile: LoginDetails;
  locations: {
    [sapId: string]: LocationWithRoles;
  };
}

export interface LocationWithRoles extends Location {
  roles: {
    [roleId: string]: Role;
  };
}

export interface GetUserRolesResponseObject {
  userId: string;
  userName: string;
  sapAccountId: string;
  sapAccountName: string;
  roleName: string;
  lobIdArray: lobRoleIdObject[];
}

export interface lobRoleIdObject {
  lob: string;
  roleId: string;
}

export interface GetUserProfileResponse {
  status: number;
  data: UserProfile;
  message: string;
}

export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  primaryPhone: string;
  secondaryPhone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  sapAccountIds: string[];
  roles: UserProfileRoleObject[];
}

export interface UserProfileRoleObject {
  identity: {
    low: number;
    high: number;
  };
  labels: string[];
  properties: Role;
}

export interface LoginDetails extends User {
  contact_glopid: string;
  lastLogin: string;
  status: string;
}

export interface AddUserRoleRequestBody {
  lobList: string[];
}

export interface LocationData {
  id: string;
  name: string;
}

export interface HybrisLocationData {
  accountName: string;
  sapAccountId: string;
}

export interface HybrisHeadquartersResponse {
  accounts: HybrisLocationData[]
}
