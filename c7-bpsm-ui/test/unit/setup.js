import Vue from 'vue';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
// @ts-ignore
import VueElement from '@monsantoit/element-vue';
import VueC7 from '@monsantoit/c7-elements';
import buildRouter from '@/router';
import expect from 'expect';

Vue.config.productionTip = false;

const router = buildRouter('/test');

Vue.use(Vuex);
Vue.use(VueI18n);
Vue.use(VueElement);

// resolves c7-elements dependent warnings for specs
const c7Module = {
  actions: {
    initialize() {},
  },
  mutations: {
    setAPIEnvironment() {},
  },
  namespaced: true,
  state: {
    environment: 'development',
    gigyaToken: '',
    user: {
      brand: 'national',
      userType: 'grower',
    },
  },
};

const store = new Vuex.Store({
  modules: {
    c7: c7Module,
  },
  strict: true,
});

Vue.use(VueRouter);
Vue.use(router);
Vue.use(VueC7, {
  appName: 'Admin Portal',
  appPath: '/c7',
  baseURL: 'https://c7-admin.velocity-np.ag',
  env: 'development',
  store,
  token: '', // local only
  router,
});

//
// custom matchers
//
expect.extend({
  toHaveText(received, argument) {
    // remove newlines, tabs, and extra spaces
    const _received = received
      .replace(/\r|\n|\t/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    const pass = _received === argument;
    if (pass) {
      return {
        message: () => `text '${_received}' had text '${argument}'`,
        pass: true,
      };
    }
    return {
      message: () => `text '${_received}' did not have text '${argument}'`,
      pass: false,
    };
  },
});

// mutation observer does not exist on jest DOM, and element-vue lib uses MutationObserver
global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
};
