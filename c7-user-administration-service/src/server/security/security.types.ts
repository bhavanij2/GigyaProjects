
export interface EntitlementsTree {
  [scopeid: string]: string[];
}

export interface ExternalUserProfile {
  username: string;
  brand: string;
  persona: string;
  federationId: string;
  firstName: string;
  lastName: string;
}

export interface InternalUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  partyId: string;
  entitlements: EntitlementsTree;
}
