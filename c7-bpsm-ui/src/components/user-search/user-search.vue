<template>
  <div>
    <form @keyup.enter="submit" class="ua-form">
      <!-- Headline -->
      <lmnt-grid-row class="ua-form-row">
        <lmnt-grid-col :phone-col=4 :tablet-col=4 :desktop-col=5 class="ua-form-col">
          <lmnt-typo-headline :level=6>{{$t('userSearch.overline')}}</lmnt-typo-headline>
        </lmnt-grid-col>
      </lmnt-grid-row>

      <!-- Form Row 1 -->
      <lmnt-grid-row class="ua-form-row" v-if="isInternalAdmin">
        <lmnt-grid-col :phone-col=4 :tablet-col=4 :desktop-col=6 class="ua-form-col">
          <LocationSelector class="ua-form-text-field" :label="$t('userSearch.companyHq')"
            :locations="companyHqs" :invalid="false" :loading="companyHqs.length < 1"
            v-model="form.companyHq" @input="updateCompanyLocations"/>
        </lmnt-grid-col>
      </lmnt-grid-row>
      <lmnt-grid-row class="ua-form-row" v-if="isInternalAdmin && brandOptions.length > 1">
        <lmnt-grid-col :phone-col=4 :tablet-col=4 :desktop-col=6 class="ua-form-col">
          <lmnt-autocomplete class="ua-form-text-field" :label="$t('userSearch.brand')"
            :options="brandOptions" v-model="form.brand" secondary />
        </lmnt-grid-col>
      </lmnt-grid-row>
      <lmnt-grid-row class="ua-form-row" v-if="isInternalAdmin && personaOptions.length > 1">
        <lmnt-grid-col :phone-col=4 :tablet-col=4 :desktop-col=6 class="ua-form-col">
          <lmnt-autocomplete class="ua-form-text-field" :label="$t('userSearch.persona')"
            :options="personaOptions" v-model="form.persona" secondary />
        </lmnt-grid-col>
      </lmnt-grid-row>
      <lmnt-grid-row class="ua-form-row" v-if="isInternalAdmin && countryOptions.length > 1">
        <lmnt-grid-col :phone-col=4 :tablet-col=4 :desktop-col=6 class="ua-form-col">
          <lmnt-autocomplete class="ua-form-text-field" :label="$t('userSearch.country')"
            :options="countryOptions" v-model="form.country" secondary />
        </lmnt-grid-col>
      </lmnt-grid-row>
      <!-- Form Row 2 -->
      <lmnt-grid-row class="ua-form-row" :class="!isInternalAdmin ? 'ua-form-row-first' : ''">
        <lmnt-grid-col :phone-col=4 :tablet-col=4 :desktop-col=6 class="ua-form-col">
          <LocationSelector class="ua-form-text-field" :label="$t('userSearch.location')"
              :locations="companyLocations" :invalid="false" :loading="locationsLoading"
              :disabled="locationsLoading" v-model="form.location" />
        </lmnt-grid-col>
      </lmnt-grid-row>
      <!-- Form Row 3 -->
      <lmnt-grid-row class="ua-form-row">
        <lmnt-grid-col :phone-col=4 :tablet-col=4 :desktop-col=6 class="ua-form-col">
          <lmnt-textfield class="ua-form-text-field" :label="$t('userSearch.email')"
            v-model="form.id" secondary />
        </lmnt-grid-col>
      </lmnt-grid-row>

      <lmnt-grid-row class="ua-form-row">
        <lmnt-grid-col :phone-col=4 :tablet-col=4 :desktop-col=6 class="ua-form-col">
            <lmnt-textfield class="ua-form-text-field" :label="$t('userSearch.firstName')"
              v-model="form.first_name" :invalid="false" secondary />
        </lmnt-grid-col>
      </lmnt-grid-row>

      <lmnt-grid-row class="ua-form-row">
        <lmnt-grid-col :phone-col=4 :tablet-col=4 :desktop-col=6 class="ua-form-col">
          <lmnt-textfield class="ua-form-text-field" :label="$t('userSearch.lastName')"
            v-model="form.last_name" secondary />
        </lmnt-grid-col>
      </lmnt-grid-row>

      <lmnt-grid-row class="ua-form-row">
        <lmnt-grid-col :phone-col=4 :tablet-col=4 :desktop-col=6 class="ua-form-col">
          <lmnt-typo-subtitle class="ua-user-status-label" :level="2">{{$t('userSearch.status')}}</lmnt-typo-subtitle>
          <lmnt-checkbox :label="$t('userSearch.active')" v-model="form.status.active" />
          <lmnt-checkbox :label="$t('userSearch.inactive')" v-model="form.status.inactive" />
          <lmnt-checkbox :label="$t('userSearch.pending')" v-model="form.status.pending" />
        </lmnt-grid-col>
      </lmnt-grid-row>
      <!-- Form Actions/Submit -->
      <lmnt-grid-row class="ua-form-row ua-form-actions">
        <lmnt-grid-col class="ua-form-col ua-form-buttons" :phone-col=12 :tablet-col=12 :desktop-col=6>
          <lmnt-button tabindex="6" @click="clearData">{{$t('userSearch.clear')}}</lmnt-button>
          <lmnt-button tabindex="7" @click="submit" primary>{{$t('userSearch.search')}}</lmnt-button>
        </lmnt-grid-col>
      </lmnt-grid-row>
      <hr class="ua-form-divider">
    </form>

    <user-results aria-res="res"  class="ua-results-table" v-if="userSearchResults.length" :users="userSearchResults" />
    <lmnt-linear-progress class="ua-results-loading" indeterminate v-else-if="resultsLoading"/>
    <!-- Error Display -->
    <lmnt-grid-row v-if="error" class="ua-error">
      <lmnt-grid-col :phone-col=12 :tablet-col=12 :desktop-col=12>
        <lmnt-typo-headline :level="5">{{error}}</lmnt-typo-headline>
      </lmnt-grid-col>
    </lmnt-grid-row>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState, mapMutations } from 'vuex';
import LocationSelector from '@/components/global/location-selector';

import { isInternalAdminType, filterAutocompleteList, getInternalPermissionProperty } from '@/utils/utils';

import auth from '@/mixins/auth.mixin';
import ValidationMixin from '@/mixins/validation.mixin';

import UserResults from './components/user-results.vue';
import agent from '@/utils/agent';
import { LocationData } from '../../types';

const UserSearch = {
  components: {
    LocationSelector,
    'user-results': UserResults,
  },
  computed: {
    ...mapState('ua', [
      'companyHqs',
      'hqSapId',
      'internalEntitlements',
      'userSearchResults',
      'companyLocations',
    ]),
    brandOptions() {
      return getInternalPermissionProperty(this.internalEntitlements, 'brand', '$:uadmin:search-user:read');
    },
    countryOptions() {
      return getInternalPermissionProperty(this.internalEntitlements, 'country', '$:uadmin:search-user:read');
    },
    isInternalAdmin() {
      return isInternalAdminType(this.$store.state.ua.adminType);
    },
    personaOptions() {
      return getInternalPermissionProperty(this.internalEntitlements, 'persona', '$:uadmin:search-user:read');
    },
    selectedStatus () {
      return Object.keys(this.form.status).filter(k => this.form.status[k]);
    }
  },
  data: () => ({
    error: false,
    form: {
      brand: '',
      companyHq: { id: '', name: undefined },
      first_name: '',
      id: '',
      last_name: '',
      location: { id: '', name: undefined },
      status: {
        active: false,
        inactive: false,
        pending: false,
      },
    },
    locationsLoading: false,
    resultsLoading: false,
  }),
  methods: {
    ...mapActions('ua', [
      'fetchUsers',
      'getAllCompanyLocations',
    ]),
    ...mapMutations('ua', [
      'resetCompanyLocations',
    ]),
    clearData() {
      this.reset();
      this.form = {
        brand: '',
        companyHq: { id: '', name: undefined },
        country: '',
        first_name: '',
        id: '',
        last_name: '',
        location: { id: '', name: undefined },
        persona: '',
        status: {
          active: false,
          inactive: false,
          pending: false,
        }
      };
    },
    getSelection(prop: string) {
      if (this.form[prop]) { return this.form[prop] }
      return this[`${prop}Options`].join(',');
    },
    reset() {
      [ this.resultsLoading, this.locationsLoading, this.error ] = [ false, false, false ];
      this.$store.commit('ua/setUserSearchResults', []);
    },
    async submit() {
      try {
        this.reset();
        this.resultsLoading = true;
        const { location, companyHq, ...payload } = this.form;
        payload.brand = this.isInternalAdmin ? this.getSelection('brand') : this.$store.state.c7.user.brand;
        payload.persona = this.isInternalAdmin ? this.getSelection('persona') : this.$store.state.c7.user.userType;
        payload.country = this.isInternalAdmin ? this.getSelection('country') : this.$store.state.c7.user.country;
        payload.hqSapId = this.isInternalAdmin ? companyHq.id : this.$store.state.ua.hqSapId;
        payload.testUser = this.isInternalAdmin ? null : 'no';
        payload.sapId = location.id;
        payload.status = this.selectedStatus.join(',');
        await this.fetchUsers({
          env: this.$store.state.c7.APIEnvironment,
          ...payload,
        });
      } catch (e) {
        this.error = e.message;
        console.error(e.message);
      } finally {
        this.resultsLoading = false;
      }
    },
    async updateCompanyLocations(value: LocationData, old: LocationData) {
      if(value.id !== old.id) {
        this.form.location = { id: '', name: undefined };
        if(this.companyHqs.find((c:LocationData) => c.id === `000${value.id}`)) {
          this.locationsLoading = true;
          try {
            await this.getAllCompanyLocations({
              env: this.$store.state.c7.APIEnvironment,
              sapAccountId: value.id,
            });
          } catch (e) {
            console.error(`Error while fetching company heirarchy: ${e.message}`);
          } finally {
            this.locationsLoading = false;
          }
        } else {
          this.resetCompanyLocations();
        }
      }
    }
  },
  mixins: [auth, ValidationMixin],
  name: 'user-search',
};

export default UserSearch;
</script>

<style lang="scss">

.mdc-layout-grid.c7-usersearch {
  padding: 80px;

  .ua-form-text-field {
    &.mdc-text-field, & .mdc-text-field, &.mdc-select, & .mdc-autocomplete-container, &.mdc-autocomplete-container {
      width: 100%;
      margin: 0;
    }
  }

  .ua-form {
    margin-top: 40px;
  }

  .ua-form-row {
    margin-bottom: 40px;
  }

  @media (min-width: 840px) {
    .ua-form-col {
      grid-column-start: 4;
    }
  }

  .ua-help-text, .helptext {
    padding-top: 4px;
    margin-bottom: 0;
  }

  // TODO: Design Refinement
  .loading {
    position: absolute;
    color: grey;
    margin-left: 8px;
    font-size: 36px;
  }

  .ua-user-status-label {
    display: block;
  }

  .ua-form-divider {
    margin: 48px 0 0;
  }

  .ua-results-table, .ua-error, .ua-results-loading {
    margin-top: 64px;
  }

  .ua-search-dropdown-container {
    position: relative;

    .ua-dropdown-loading {
      position: absolute;
      right: -48px;
      top: 10px;
      height: 24px;
      width: 24px;
    }
  }

  .ua-form-buttons {
    margin-left: auto;
  }
}
</style>
