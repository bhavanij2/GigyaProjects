import { mount, RouterLinkStub, createLocalVue } from '@vue/test-utils';

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
  getMockRole,
} from '../utils';

const localVue = createLocalVue();
setUpLocalVue(localVue);

describe('Internal user-search.vue', () => {
  const actions = getUAActions();
  const mutations = getUAMutations();
  const uaModule = getUAModule('Internal', actions, mutations);
  const c7Module = getC7Module();
  const store = createMockStore('Internal', c7Module, uaModule);
  const addUserWrapper = mount(AddUser, {
    i18n: getI18N(),
    localVue,
    router: buildRouter('/test'),
    store,
    stubs: {
      'router-link': RouterLinkStub,
    },
  });

  it('does not call getAdminLocations as internal admin on mounted', () => {
    expect(actions.getAdminLocations).not.toHaveBeenCalled();
  });

  it('contains .ua-form class', () => {
    const formElement = addUserWrapper.find('.ua-form');
    expect(formElement.exists()).toBe(true);
  });

  it('has 4 form rows', () => {
    const formRows = addUserWrapper.findAll('.ua-form-row');
    const expectedNumRows = 5;
    expect(formRows.length).toBe(expectedNumRows);
  });

  it('contains 5 text fields', () => {
    const expectedNumTextFields = 7;
    const textFieldElements = addUserWrapper.findAll('.ua-form-text-field');
    expect(textFieldElements.length).toBe(expectedNumTextFields);
  });

  it('contains the correct text fields in correct order', () => {
    const textFieldElements = addUserWrapper.findAll('.ua-form-text-field');
    const expectedOrderedTextFields = ['First Name', 'Email', 'Last Name', 'Confirm Email', 'Company HQ'];

    expectedOrderedTextFields.forEach((textField, idx) => {
      const textFieldElement = textFieldElements.at(idx);
      expect(textFieldElement.text().includes(textField)).toBe(true);
    });
  });

  it('displays assistive text when company hq is not editable', () => {
    addUserWrapper.vm.$data.roles = [
      getMockRole('Site Manager'),
      getMockRole('Branch Account'),
      getMockRole('External Admin'),
    ];

    expect((addUserWrapper.vm as any).isDisabledCompanyHq).toEqual(true);
  });

  it('does not display assistive text when company hq is editable', () => {
    addUserWrapper.vm.$data.roles = [];

    expect((addUserWrapper.vm as any).isDisabledCompanyHq).toEqual(false);
  });
});
