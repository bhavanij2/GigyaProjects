import { mount, RouterLinkStub, createLocalVue, } from '@vue/test-utils';

import buildRouter from '@/router';
import ExternalApp from '@/ExternalApp.vue';

import {
  setUpLocalVue,
  createMockStore,
  getI18N,
  getUAActions,
  getUAMutations,
  getUAModule,
  getC7Module,
} from './utils';

const localVue = createLocalVue();
setUpLocalVue(localVue);

describe('ExternalApp.vue', () => {
  const actions = getUAActions();
  const mutations = getUAMutations();
  const uaModule = getUAModule('External', actions, mutations);
  const c7Module = getC7Module('', 'myGigyaToken');
  const store = createMockStore('External', c7Module, uaModule);
  const _ = mount(ExternalApp, {
    i18n: getI18N(),
    localVue,
    router: buildRouter('/test'),
    store: store,
    stubs: {
      'router-link': RouterLinkStub,
    },
  });

  it('sets External tokens when ExternalApp is loaded', () => {
    expect(mutations.setExternalToken).toHaveBeenCalled();
  });
});
