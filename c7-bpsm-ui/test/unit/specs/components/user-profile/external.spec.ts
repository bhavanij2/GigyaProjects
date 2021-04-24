import { mount, RouterLinkStub, createLocalVue, shallowMount, } from '@vue/test-utils';

import buildRouter from '@/router';
import UserProfile from '@/components/user-profile/user-profile.vue';

import {
  setUpLocalVue,
  createMockStore,
  getI18N,
  getUAActions,
  getUAMutations,
  getUAModule,
  getC7Module,
  getUAState,
  getUserProfile,
  getAdminLocations,
} from '../utils';

const localVue = createLocalVue();
setUpLocalVue(localVue);

describe('External user-profile.vue', () => {
  const actions = getUAActions();
  const mutations = getUAMutations();
  const uaModule = getUAModule('External', actions, mutations);
  const c7Module = getC7Module(':uadmin:deactivate-user:write');
  const store = createMockStore('External', c7Module, uaModule);
  const userProfileWrapper = mount(UserProfile, {
    i18n: getI18N(),
    localVue,
    router: buildRouter('/test'),
    store,
    stubs: {
      'router-link': RouterLinkStub,
    },
  });

  it('contains .c7-userprofile class', () => {
    const profileElement = userProfileWrapper.find('.c7-userprofile');
    expect(profileElement.exists()).toBe(true);
  });

  it('the deactivate switch is enabled because user is admin at location', () => {
    var state = getUAState('External');
    const uaModule = getUAModule('External', actions, mutations, state);
    const store = createMockStore('External', c7Module, uaModule);
    const userProfileWrapper = shallowMount(UserProfile, {
      i18n: getI18N(),
      localVue,
      router: buildRouter('/test'),
      store,
      stubs: {
        'router-link': RouterLinkStub,
      },
    });

    state.adminLocations = getAdminLocations(true);
    state.userProfile = getUserProfile(true);
    
    const switchElement = userProfileWrapper.find('.ua-status-switch');
    expect(switchElement.exists()).toBe(true);

    expect(switchElement.vm.$props.disabled).toBe(false);
  });
});
