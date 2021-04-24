import shiroTrie from 'shiro-trie';
import Cookies from 'js-cookie';
import { Module } from 'vuex';

import actions from './actions';
import mutations from './mutations';
import { UserAdminRootState } from '../types';
import { EMPTY_ROLE_DATA } from '@/utils/constants';

const userAdminState: UserAdminRootState = {
  adminLocations: [],
  adminRoles: [],
  adminType: 'Unknown',
  companyHqs: [],
  companyLocations: [],
  entitlements: shiroTrie.newTrie(),
  errorMessageOpen: false,
  externalToken: Cookies.get('c7_access_token') || '',
  hqSapId: '',
  internalEntitlements: [],
  internalToken: Cookies.get('internal_token') || '',
  roleControl: { open: false, role: EMPTY_ROLE_DATA, context: 'add' },
  rolesTableLoading: false,
  selectedHq: {
    id: '',
    name: '',
  },
  userProfile: { profile: {}, locations: {} },
  userSearchResults: [],
};

const userAdminStore: Module<UserAdminRootState, any> = {
  actions,
  mutations,
  namespaced: true,
  state: userAdminState,
};

export default userAdminStore;
