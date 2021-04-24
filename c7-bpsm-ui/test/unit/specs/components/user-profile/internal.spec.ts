import { mount, RouterLinkStub, createLocalVue, } from '@vue/test-utils';

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
} from '../utils';

const localVue = createLocalVue();
setUpLocalVue(localVue);

describe('Internal user-profile.vue', () => {

  const actions = getUAActions();
  const mutations = getUAMutations();
  const uaModule = getUAModule('Internal', actions, mutations);
  const c7Module = getC7Module();
  const store = createMockStore('Internal', c7Module, uaModule);
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
});
