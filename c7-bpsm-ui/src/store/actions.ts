import { ActionTree } from 'vuex';
import agent from '../utils/agent';
import { to } from 'await-to-js';
import { AdminType, UserAdminRootState, AdminContext, LocationData } from '../types';

const actions: ActionTree<UserAdminRootState, UserAdminRootState> = {
  async checkEmailAvailability({dispatch, state}, payload) {
    try {
      const context = extractAdminContext(state);
      const response = await agent.getEmailAvailability(payload, context);
      return response.isAvailable;
    } catch (err) {
      dispatch('c7/log', { code: err.name, level: 'error', message: err.message }, { root: true });
      throw new Error('Failed to check email availability');
    }

  },
  async editUserRole({dispatch, state}, payload) {
    try {
      const context = extractAdminContext(state);
      await agent.editUserRole(payload, context);
    } catch (err) {
      dispatch('c7/log', { code: err.name, level: 'error', message: err.message }, { root: true });
      throw new Error('Failed to edit user role');
    }
  },
  async fetchUsers({commit, dispatch, state}, payload) {
    const context = extractAdminContext(state);
    const [ err, users ] = await to(agent.fetchUsers({...payload}, context));

    if (err) {
      commit('setUserSearchResults', []);
      dispatch('c7/log', { code: err.name, level: 'error', message: err.message }, { root: true });
      throw new Error('Encountered an Error While Searching. Please Try Again Later. ',);
    }
    if (users.length <= 0) {
      commit('setUserSearchResults', []);
      throw new Error('No Users Returned');
    }

    return commit('setUserSearchResults', users);
  },
  // todo: reuse?
  async getLocationInfo({dispatch, state}, payload) {
    try {
      const context = extractAdminContext(state);
      const locationInfo = await agent.getLocationInfo({
        env: payload.env,
        locationId: payload.sapAccountId,
      }, context);
      return locationInfo;
    } catch (err) {
      dispatch('c7/log', { code: err.name, level: 'log', message: err.message }, { root: true });
    }
  },
  async getAllCompanyLocations({ commit, dispatch, state }, payload: any) {
    try {
      const context = extractAdminContext(state);
      const locationInfo = await agent.getLocationInfo({
        env: payload.env,
        locationId: payload.sapAccountId,
      }, context);

      const locations = await agent.getLocationChildren({
        env: payload.env,
        locationId: locationInfo.hqSapId,
      }, context);
      commit('setCompanyLocations', locations);
    } catch (err) {
      console.error('Error occurred while fetching company locations: ', err.message);
      commit('setErrorMessageOpen', true);
      dispatch('c7/log', { code: err.name, level: 'error', message: err.message }, { root: true });
    }
  },
  async getAdminRoles({commit, dispatch, state}, payload: any) {
    try {
      const context = extractAdminContext(state);
      const { identities, env } = payload;
      const beta = context.adminType === 'External' ? 'false' : null;

      const requests = identities.map((i: any) => {
        return agent.getAdminRoles({beta, ...i, env}, context);
      });
      const responses = await Promise.all(requests);
      // @ts-ignore
      const adminRoles = responses.flat();
      commit('setAdminRoles', adminRoles);
    } catch (err) {
      console.error('Error occurred while fetching admin permissions: ', err.message);
      commit('setErrorMessageOpen', true);
      dispatch('c7/log', { code: err.name, level: 'error', message: err.message }, { root: true });
    }
  },
  async getAdminLocations({commit, dispatch, state}, payload: any) {
    try {
      const context = extractAdminContext(state);
      if (context.adminType === 'Internal') {
        const locations = await agent.getAdminLocationsByHqSapId(payload, context);
        commit('setAdminLocations', locations);
      } else {
        const locations = await agent.getAdminLocations(payload, context);
        commit('setAdminLocations', locations);
      }
    } catch (err) {
      commit('setErrorMessageOpen', true);
      dispatch('c7/log', { code: err.name, level: 'error', message: err.message }, { root: true });
    }
  },
  async getUserProfile({ commit, dispatch, state }, payload: any) {
    try {
      const context = extractAdminContext(state);
      const userInfo = await agent.getUserProfile(payload, context);
      commit('setUserProfile', userInfo);
    } catch (err) {
      commit('setErrorMessageOpen', true);
      dispatch('c7/log', { code: err.name, level: 'error', message: err.message }, { root: true });
    }
  },
  async grantUserNewRole({ dispatch, state }, payload) {
    try {
      const context = extractAdminContext(state);
      await agent.grantUserNewRole(payload, context);
    } catch (err) {
      dispatch('c7/log', { code: err.name, level: 'error', message: err.message }, { root: true })
      throw new Error('Failed to grant user role');
    }
  },

  async preregister({ dispatch, state }, payload) {
    try {
      const context = extractAdminContext(state);
      await agent.preregister(payload, context);
    } catch (err) {
      dispatch('c7/log', { code: err.name, level: 'error', message: err.message }, { root: true });
      throw new Error('Failed to preregister user');
    }
  },
  async removeUserRole({ dispatch, state }, payload) {
    try {
      const context = extractAdminContext(state);
      await agent.removeUserRole(payload, context);
    } catch (err) {
      dispatch('c7/log', { code: err.name, level: 'error', message: err.message }, { root: true })
      throw new Error('Failed to remove user role');
    }
  },
  async setAdminType({ commit }, payload: AdminType){
    commit('setAdminType', payload);
  },
  async changeUserStatus({ dispatch, state }, payload) {
    try {
      const context = extractAdminContext(state);
      await agent.changeUserStatus(payload, context);
    } catch (err) {
      dispatch('c7/log', { code: err.name, level: 'error', message: err.message }, { root: true });
      throw new Error('Failed to change the user status');
    }
  },
  async fetchCompanyHqs({commit, dispatch, state}, payload) {
    const context = extractAdminContext(state);
    const [ err, companyHqs ] : [ Error | null, LocationData[]]
      = await to(agent.fetchCompanyHqs({...payload}, context));
    if (err) {
      commit('setCompanyHqs', []);
      dispatch('c7/log', { code: err.name, level: 'error', message: err.message }, { root: true });
      commit('setErrorMessageOpen', true);
      throw new Error('Encountered an Error While Retrieving company hqs. Please Try Again Later.');
    }
    return commit('setCompanyHqs', companyHqs);
  },
  async getInternalEntitlements({commit, dispatch, state}, payload) {
    try {
      const context = extractAdminContext(state);
      const entitlements = await agent.getInternalEntitlements(payload, context);
      commit('setInternalEntitlements', entitlements);
    } catch (err) {
      commit('setErrorMessageOpen', true);
      dispatch('c7/log', { code: err.name, level: 'error', message: err.message }, { root: true });
      throw new Error('Failed to get internal entitlements');
    }
  }
};

function extractAdminContext(state: UserAdminRootState): AdminContext {
  return {
    adminType: state.adminType,
    externalToken: state.externalToken,
    internalToken: state.internalToken,
  }
}

export default actions;
