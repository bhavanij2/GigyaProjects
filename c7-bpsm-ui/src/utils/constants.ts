import moment from 'moment';
import { RoleData, SearchMethod } from '@/types';

/* tslint:disable-next-line */
export const STATES = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];
export const EPOCH = moment(0).toISOString();
export const EMPTY_ROLE_DATA: RoleData = {
  lob: '',
  location: { id: '', name: '' },
  roleName: ''
};
export const LOB_MAP = {
  '*': 'All',
  acceleron: 'Seed Treatment',
  bioag: 'Bio-Enhancers',
  cp: 'Crop Protection',
  lic: 'Licensee',
  seed: 'Seed',
};
export const INVERSE_LOB_MAP = {
  'Bio-Enhancers': 'bioag',
  'Crop Protection': 'cp',
  'Licensee': 'lic',
  'Seed': 'seed',
  'Seed Treatment': 'acceleron',
};

// TODO: MOVE TO ENDPOINT FOR ACCESSING ROLE INFO
export const ROLE_MAP = {
  'Admin': 'uadmin',
  'Financial User': 'fu',
  'Standard User': 'su',
};

export const SEARCH_METHODS = {
  [SearchMethod.EMAIL]: 'By Email (Username)',
  [SearchMethod.SAP_ID]: 'By Account ID',
  [SearchMethod.COMPANY_HQ]: 'By Company',
};
