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

describe('Internal user-roles.vue', () => {

  const actions = getUAActions();
  const mutations = getUAMutations();
  const uaModule = getUAModule('Internal', actions, mutations);
  const c7Module = getC7Module();
  const store = createMockStore('Internal', c7Module, uaModule);
  const userRolesWrapper = mount(UserRoles, {
    i18n: getI18N(),
    localVue,
    router: buildRouter('/test'),
    store,
    stubs: {
      'router-link': RouterLinkStub,
    },
  });

  it('calls actions as internal admin on mounted', () => {
    expect(actions.getAdminLocations).not.toHaveBeenCalled();
  });

  it('contains .ua-roles-table class', () => {
    const tableElement = userRolesWrapper.find('.ua-roles-table');
    expect(tableElement.exists()).toBe(true);
  });

  it('add role button is disabled with no company hq', () => {
    const addRoleButton = userRolesWrapper.find('.ua-add-role-button');
    expect(addRoleButton.vm.$attrs.disabled).toBe(true);
  });

  // TODO: enable
  it.skip('add role button is enabled when company hq, brand, and persona is present', () => {
    const userRolesWrapper = mount(UserRoles, {
      i18n: getI18N(),
      localVue,
      router: buildRouter('/test'),
      store,
      stubs: {
        'router-link': RouterLinkStub,
      },
      propsData: {
        companyHq: '123456789',
        formData: {
          brand: 'national',
          persona: 'dealer,'
        }
      }
    });

    const addRoleButton = userRolesWrapper.find('.ua-add-role-button');
    expect(addRoleButton.vm.$attrs.disabled).toBe(false);
  });
});
