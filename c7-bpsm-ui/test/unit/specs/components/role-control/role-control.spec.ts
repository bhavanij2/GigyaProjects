import { mount, RouterLinkStub, createLocalVue, shallowMount, } from '@vue/test-utils';

import buildRouter from '@/router';
import roleControl from '@/components/role-control/role-control.vue';

import {
  setUpLocalVue,
  createMockStore,
  getI18N,
  getUAActions,
  getUAMutations,
  getUAModule,
  getUAState,
  getC7Module,
  getRoleControl,
  getSelectedHq,
} from '../utils';
import { EMPTY_ROLE_DATA } from '@/utils/constants';

const localVue = createLocalVue();
setUpLocalVue(localVue);

describe('role-control.vue', () => {

  const actions = getUAActions();
  const mutations = getUAMutations();
  const uaModule = getUAModule('Internal', actions, mutations); 
  const c7Module = getC7Module();
  const store = createMockStore('Internal', c7Module, uaModule);
  const roleControlWrapper = mount(roleControl, {
    i18n: getI18N(),
    localVue,
    router: buildRouter('/test'),
    store,
    stubs: {
      'router-link': RouterLinkStub,
    },
  });

  it('contains .ua-role-control class', () => {
    const roleControlElement = roleControlWrapper.find('.ua-role-control');
    expect(roleControlElement.exists()).toBe(true);
  });

  it('modal is not open initially', () => {
    const modalElement = roleControlWrapper.find('.role-control-modal');
    expect(modalElement.exists()).toBe(true);

    expect(modalElement.vm.$props.open).toBe(false);
  });

  it('modal is open when prop is true', () => {
    const roleControlWrapper = mount(roleControl, {
      i18n: getI18N(),
      localVue,
      router: buildRouter('/test'),
      store,
      stubs: {
        'router-link': RouterLinkStub,
      },
      propsData: {
        open: true,
      }
    });

    const modalElement = roleControlWrapper.find('.role-control-modal');
    expect(modalElement.exists()).toBe(true);

    expect(modalElement.vm.$props.open).toBe(true);
  });

  it('modal is correct when role context is delete', () => {
    const roleControlState = getRoleControl(true, EMPTY_ROLE_DATA, 'delete');
    const state = getUAState('Internal', getSelectedHq(), roleControlState);
    const uaModule = getUAModule('External', actions, mutations, state);
    const store = createMockStore('Internal', c7Module, uaModule);
    const roleControlWrapper = mount(roleControl, {
      i18n: getI18N(),
      localVue,
      router: buildRouter('/test'),
      store,
      stubs: {
        'router-link': RouterLinkStub,
      },
    });

    const deleteMessageElement = roleControlWrapper.find('.ua-delete-role-body');
    expect(deleteMessageElement.exists()).toBe(true);
  });

  it('fields are disabled when no location', () => {
    expect(roleControlWrapper.vm.$data.locationInvalid).toBe(true);
    
    const roleControlTextFields = roleControlWrapper.findAll('.ua-role-control-text-field');

    expect(roleControlTextFields.length).toBe(3);

    const lobField = roleControlTextFields.at(1);
    const roleField = roleControlTextFields.at(2);

    expect(lobField.vm.$props.disabled).toBe(true);
    expect(roleField.vm.$props.disabled).toBe(true);
  });
});
