import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex, { Store } from 'vuex';
import VueI18n from 'vue-i18n';
import VuexPersist from 'vuex-persist';

import VueElement from '@monsantoit/element-vue';
import VueC7, { c7Module } from '@monsantoit/c7-elements';

import ExternalApp from './ExternalApp.vue';
import buildRouter from './router';
import storeOptions from './store';
import { getEnv } from './utils/utils';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueElement);
Vue.use(VueI18n);

const appPath = '/admin';

const c7Options = {
  appName: 'External UA Portal',
  appPath,
  baseURL: process.env.BASE_URL || '',
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
const router = buildRouter('/');

Vue.use(VueC7, {
  ...c7Options,
  env: getEnv(),
  router,
  store,
  token: '', // local only
});

/* tslint:disable no-shadowed-variable */
const render = (App: any, router: VueRouter, store: Store<any>) => {
  store.commit('ua/setAdminType', 'External');

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

render(ExternalApp, router, store);
