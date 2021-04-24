import { mount, RouterLinkStub, createLocalVue, } from '@vue/test-utils';

import buildRouter from '@/router';
import AddUser from '@/components/add-user.vue';

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

describe('External add-user.vue', () => {

  const actions = getUAActions();
  const mutations = getUAMutations();
  const uaModule = getUAModule('External', actions, mutations);
  const c7Module = getC7Module();
  const store = createMockStore('External', c7Module, uaModule);
  const addUserWrapper = mount(AddUser, {
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

  it('contains .ua-form class', () => {
    const formElement = addUserWrapper.find('.ua-form');
    expect(formElement.exists()).toBe(true);
  });

  it('has 3 form rows', () => {
    const formRows = addUserWrapper.findAll('.ua-form-row');
    const expectedNumRows = 3;
    expect(formRows.length).toBe(expectedNumRows);
  });

  it('contains 4 text fields', () => {
    const expectedNumTextFields = 4;
    const textFieldElements = addUserWrapper.findAll('.ua-form-text-field');
    expect(textFieldElements.length).toBe(expectedNumTextFields);
  });

  it('contains the correct text fields in correct order', () => {
    const textFieldElements = addUserWrapper.findAll('.ua-form-text-field');
    const expectedOrderedTextFields = [
      'First Name',
      'Email',
      'Last Name',
      'Confirm Email',
    ];

    expectedOrderedTextFields.forEach((textField, idx) => {
      const textFieldElement = textFieldElements.at(idx);
      expect(textFieldElement.text().includes(textField)).toBe(true);
    });
  });
});
