import { MutationTree } from 'vuex';
import { AdminType, UserAdminRootState, RoleData, RoleControlContext, LocationData } from '../types';

const mutations: MutationTree<UserAdminRootState> = {
  setInternalEntitlements(state: UserAdminRootState, entitlements: []) {
    state.internalEntitlements = entitlements;
  },
  setAdminRoles(state, roles) {
    state.adminRoles = roles;
  },
  setAdminLocations(state, locations) {
    state.adminLocations = locations;
  },
  setCompanyLocations(state, locations) {
    state.companyLocations = locations;
  },
  resetCompanyLocations(state) {
    state.companyLocations = [];
  },
  setRoleControlContext(state, context: RoleControlContext) {
    state.roleControl.context = context;
  },
  setRoleControlOpen(state, open: boolean) {
    state.roleControl.open = open;
  },
  setRoleControlData(state, role: RoleData) {
    state.roleControl.role = { ...role };
  },
  setRolesTableLoading(state, loading: boolean) {
    state.rolesTableLoading = loading;
  },
  setUserProfile(state, user) {
    state.userProfile = user;
  },
  setUserSearchResults(state, users) {
    state.userSearchResults = users;
  },
  setCompanyHqs(state, companyHqs) {
    state.companyHqs = companyHqs;
  },
  setHqSapId(state, hqSapID) {
    state.hqSapId = hqSapID;
  },
  setAdminType(state, adminType: AdminType) {
    state.adminType = adminType;
  },
  setUserStatus(state, status) {
    state.userProfile.profile.status = status;
  },
  setExternalToken(state, externalToken) {
    state.externalToken = externalToken;
  },
  setSelectedHq(state, hq: LocationData) {
    state.selectedHq = hq;
  },
  setErrorMessageOpen(state, open) {
    state.errorMessageOpen = open;
  }
};

export default mutations;
