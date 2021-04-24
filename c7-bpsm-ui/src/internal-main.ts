import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex, { Store } from 'vuex';
import VueI18n from 'vue-i18n';
import VuexPersist from 'vuex-persist';

import navbar from '@monsantoit/phoenix-navbar';
import VueElement from '@monsantoit/element-vue';
import VueC7, { c7Module } from '@monsantoit/c7-elements';
import { queries, queryProfile } from '@monsantoit/profile-client';

import InternalApp from './InternalApp.vue';
import buildRouter from './router';
import storeOptions from './store';
import { getEnv, isLocalhost } from './utils/utils';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueElement);
Vue.use(VueI18n);

const appPath = '/c7-bpsm';

const c7Options = {
  appName: 'Internal UA Portal',
  appPath,
  baseURL: process.env.BASE_URL || (isLocalhost ? 'http://localhost:3168/c7-bpsm' : ''),
};

const vuexSessionStorage = new VuexPersist({
  modules: ['c7'],
  storage: window.sessionStorage,
});

const newStoreOptions = {
  modules: {
    c7: c7Module,
    ua: storeOptions,
  },
  plugins: [vuexSessionStorage.plugin],
};

const store = new Vuex.Store(newStoreOptions);
const router = buildRouter(appPath);

Vue.use(VueC7, {
  ...c7Options,
  env: getEnv(),
  router,
  store,
  token: '', // local only
  userSetupDisabled: true,
});

/* tslint:disable no-shadowed-variable */
const render = async (App: any, router: VueRouter, store: Store<any>) => {
  store.commit('ua/setAdminType', 'Internal');
  await store.dispatch('ua/getInternalEntitlements', {
    env: store.state.c7.APIEnvironment,
  });
  
  /* tslint:disable no-unused-expression */
  new Vue({
    components: { App },
    el: '#app',
    i18n: new VueI18n({
      fallbackLocale: 'en',
      locale: 'en',
    }),
    router,
    store,
    template: '<App/>',
  });
};

navbar
  .install({
    cookieName: 'internal_token',
    element: document.querySelector('.nav'),
    productId: 'brand-portal-support-manager',
    staticCSS: true,
    suiteId: 'brand-portal-support',
  })
  .then(async () => {
    render(InternalApp, router, store);
  })
  .catch((errors: any) => {
    console.error('Phoenix navbar startup errors:', errors);
  });
