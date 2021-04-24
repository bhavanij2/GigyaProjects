import { mount, RouterLinkStub, createLocalVue, } from '@vue/test-utils';

import buildRouter from '@/router';
import UserRoles from '@/components/user-roles.vue';

import {
  setUpLocalVue,
  createMockStore,
  getI18N,
  getUAActions,
  getUAMutations,
  getUAModule,
  getUAState,
  getSelectedHq,
  getC7Module,
} from '../utils';

const localVue = createLocalVue();
setUpLocalVue(localVue);

describe('External user-roles.vue', () => {

  const actions = getUAActions();
  const mutations = getUAMutations();
  const uaModule = getUAModule('External', actions, mutations);
  const c7Module = getC7Module();
  const store = createMockStore('External', c7Module, uaModule);
  const userRolesWrapper = mount(UserRoles, {
    i18n: getI18N(),
    localVue,
    router: buildRouter('/test'),
    store,
    stubs: {
      'router-link': RouterLinkStub,
    },
  });

  it('calls actions as external admin on mounted', () => {
    expect(actions.getAdminLocations).toHaveBeenCalled();
  });

  it('contains .ua-roles-table class', () => {
    const tableElement = userRolesWrapper.find('.ua-roles-table');
    expect(tableElement.exists()).toBe(true);
  });
});
