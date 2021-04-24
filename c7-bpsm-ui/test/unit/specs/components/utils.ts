import Vue, { VueConstructor } from 'vue';
import Vuex, { Module } from 'vuex';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';

import shiroTrie from 'shiro-trie';

import {
  UserAdminRootState,
  AdminType,
  UserSearchResult,
  RoleData,
  RoleControlContext,
  AdminLocationData,
} from '@/types';
import { EMPTY_ROLE_DATA } from '@/utils/constants';
import messages from '@/i18n';

export function setUpLocalVue(localVue: VueConstructor<Vue>) {
  localVue.use(VueI18n);
  localVue.use(Vuex);
  localVue.use(VueRouter);
}

export function createMockStore(
  adminType: AdminType,
  c7Module: any = getC7Module(),
  uaModule: any = getUAModule(adminType),
) {
  return new Vuex.Store({
    modules: {
      c7: c7Module,
      ua: uaModule,
    },
  });
}

export function getI18N(): VueI18n {
  return new VueI18n({
    locale: 'en',
    messages,
  });
}

export function getUAModule(
  adminType: AdminType,
  actions: any = getUAActions(),
  mutations: any = getUAMutations(),
  state: UserAdminRootState = getUAState(adminType),
): Module<UserAdminRootState, any> {
  const userAdminModule: Module<any, any> = {
    actions,
    mutations,
    namespaced: true,
    state,
  }
  return userAdminModule;
}

export function getUAState(
  adminType: AdminType,
  selectedHq: any = getSelectedHq(),
  roleControl: any = getRoleControl(),
  adminLocations: any = getAdminLocations(false),
  adminRoles: any = getAdminRoles(false),
  userProfile: any = getUserProfile(false),
): UserAdminRootState {
  const userAdminState: UserAdminRootState = {
    adminLocations,
    adminType,
    adminRoles: [],
    companyHqs: [],
    companyLocations: [],
    entitlements: shiroTrie.newTrie(),
    externalToken: '',
    hqSapId: '',
    internalEntitlements: [],
    internalToken: '',
    roleControl,
    rolesTableLoading: false,
    selectedHq,
    userProfile,
    userSearchResults: [],
    errorMessageOpen: false,
  };
  return userAdminState;
}

export function getC7Module(
  entitlements: string = '',
  gigyaToken: string = '',
): Module<any, any> {
  const c7Module: Module<any, any> = {
    actions: {},
    mutations: {},
    getters: {
      isC7Loaded: jest.fn(),
    },
    namespaced: true,
    state: {
      selectedAccount: {
        entitlements: shiroTrie.newTrie(),
        sapAccountId: 'mock-sap-id',
      },
      user: {
        federationId: 'mock-federationId',
      },
      gigyaToken,
    },
  };

  c7Module.state.selectedAccount.entitlements.add([entitlements]);

  return c7Module;
}

export function getUAActions() {
  const actions = {
    fetchUsers: jest.fn(),
    getAdminLocations: jest.fn(),
    getAdminLocationsByHqSapId: jest.fn(),
    getAdminRoles: jest.fn(),
    getAllCompanyLocations: jest.fn(),
    getUserProfile: jest.fn(),
  };
  return actions;
}

export function getUAMutations() {
  const mutations = {
    resetCompanyLocations: jest.fn(),
    setSelectedHq: jest.fn(),
    setExternalToken: jest.fn(),
  };
  return mutations;
}

export function getUserSearchResults(numUsers: number): UserSearchResult[] {
  const userSearchResults = [];
  for (let i = 0; i < numUsers; i++) {
    const user = getMockUser(`mock-first-name-${i}`, `mock-last-name-${i}`, `mock-email-${i}`);
    userSearchResults.push(user);
  }
  return userSearchResults;
}

export function getMockUser(
  firstName: string,
  lastName: string,
  id: string,
  city: string = 'mock-city',
  state: string = 'mock-state',
): UserSearchResult {
  return {
    brand: 'national',
    city,
    federationId: `mock-federation-id-${id}`,
    first_name: firstName,
    id,
    last_name: lastName,
    persona: 'dealer',
    state,
  };
}

export function getSelectedHq(
  id: string = '',
  name: string = ''
) {
  const selectedHq = {
    id,
    name,
  };
  return selectedHq;
}

export function getRoleControl(
  open: boolean = false,
  role: RoleData = EMPTY_ROLE_DATA,
  context: RoleControlContext = 'add',
) {
  const roleControl = {
    open,
    role,
    context
  };
  return roleControl;
}

export function getMockRole(prefix: string) {
  return {
    lob: `${prefix}-lob`,
    lobName: `${prefix}-lobName`,
    location: {
      name: `${prefix}-locationName`,
      sapid: `${prefix}-locationId`,
    },
    locationName: `${prefix}-locationName`,
    name: `${prefix}-roleName`,
  }
}

export function getAdminLocations(
  includeAdminLocations: boolean,
  location: AdminLocationData = mockAdminLocation('mock'),
) {
  return includeAdminLocations ? [location] : [];
}

export function getAdminRoles(
  includeAdminRoles: boolean
) {
  return [];
}

export function mockAdminLocation(prefix: string) {
  const location: AdminLocationData = {
    name: `${prefix}-name`,
    id: `${prefix}-sapid`,
    level: 'HQ',
    lob: ['seed'],
    parentId: `${prefix}-parentId`,
  };
  return location;
}

export function getUserProfile(
  includeLocations: boolean,
  locations: any = mockUserProfileLocations('mock'),
) {
  const userProfile = {
    profile: {},
    locations: includeLocations ? locations : {},
  };
  return userProfile;
}

export function mockUserProfileLocations(prefix: string) {
  const roleId = 'glb:seed:uadmin';
  const roles: any[] = [];
  roles[roleId] = {
    name: `${prefix}-role-name`,
    id: roleId,
    lob: 'seed',
    scope: 'global',
  };
  const sapId = `${prefix}-sapId`;
  const locations: any = {};
  locations[sapId] = {
    zipCode: `${prefix}-zipCode`,
    streetAddress: `${prefix}-streetAddress`,
    city: `${prefix}-city`,
    name: `${prefix}-name`,
    state: `${prefix}-state`,
    sapid: `${prefix}-sapid`,
    hqSapId: `${prefix}-hqSapId`,
    roles,
  }
  return locations;
}
