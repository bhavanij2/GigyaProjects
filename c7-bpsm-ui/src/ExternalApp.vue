<template>
  <div id="app" class="support">
    <c7-nav>
      <router-view v-if="readyToRoute"/>
    </c7-nav>
    <error-message-modal :open="errorMessageOpen" />
  </div>
</template>

<script lang="ts">
import '@monsantoit/element-core/dist/css/default.theme.element.min.css';
import '@monsantoit/c7-elements/dist/styles/c7-elements.min.css';
import { mapState, mapGetters } from 'vuex';
import en from './i18n/en.json';
import errorMessageModal from './components/error-message-model';

export default {
  beforeCreate() {
    this.$i18n.setLocaleMessage('en', en);
  },
  components: {
    errorMessageModal,
  },
  computed: {
    ...mapState('c7', [
      'user',
    ]),
    ...mapState('ua', [
      'errorMessageOpen',
    ]),
    ...mapGetters('c7', [
      'isC7Loaded',
    ]),
    readyToRoute() {
      this.$store.commit('ua/setExternalToken', this.$store.state.c7.gigyaToken);
      return this.isC7Loaded;
    },
  },
  name: 'ExternalApp',
};
</script>
