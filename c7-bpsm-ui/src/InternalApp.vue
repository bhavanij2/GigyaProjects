<template>
  <div id="app" class="support">
    <router-view v-if="!criticalErrors"/>
    <!-- todo: use c7 stateless library -->
    <div v-else class="c7-critical-error-container">
      <div class="c7-critical-error-content">
        <c7-icon-with-bg class="c7-critical-error-icon" icon="info_outline" size="lg"/>
        <div class="c7-critical-error-headline lmnt-theme-primary">
          <lmnt-typo-headline :level="5"> Oops! </lmnt-typo-headline>
        </div>
        <div class="c7-critical-error-body lmnt-theme-on-surface">
          <lmnt-typo-body :level="2">We are having trouble fetching user or company data. Please try again later.</lmnt-typo-body>
        </div>
      </div>
    </div>
    <error-message-modal :open="errorMessageOpen" />
  </div>
</template>

<script lang="ts">
import '@monsantoit/element-core/dist/css/default.theme.element.min.css';
import '@monsantoit/c7-elements/dist/styles/c7-elements.min.css';
import en from './i18n/en.json';
import errorMessageModal from './components/error-message-model';
import { mapState } from 'vuex';

export default {
  beforeCreate() {
    this.$i18n.setLocaleMessage('en', en);
  },
  components: {
    errorMessageModal,
  },
  computed: {
    ...mapState('ua', ['errorMessageOpen']),
    criticalErrors() {
      // @ts-ignore
      return this.$store.state.c7.errors.some(e => e.level === 'critical');
    },
  },
  name: 'InternalApp',
};
</script>

<style lang="scss">

.phoenix-navbar {
  animation: none;
}

</style>
