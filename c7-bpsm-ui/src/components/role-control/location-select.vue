<template>
  <c7-input autocomplete class="ua-role-control-text-field" :dropdown-max-height="150"  secondary
    :options="locationNames" :label="$t('roleControl.location')" v-model="displayValue"
    @input="validateField('location')" :invalid="$v.$error" ref="location" :filter="filterAutocompleteList" :message="getErrorMessage()"/>
</template>

<script lang="ts">
/* tslint:disable */

import { mapActions, mapState } from 'vuex';
import { debounce, uniqWith, isEqual } from 'lodash';

import {
  formatLocationInfo,
  filterAutocompleteList,
  isInternalAdminType,
} from '@/utils/utils';
import { AdminLocationData, LocationData } from '@/types';
import ValidationMixin from '@/mixins/validation.mixin';

const LocationSelect = {
  computed: {
    ...mapState('ua', [
      'adminLocations',
      'companyLocations',
      'roleControl',
    ]),
    displayValue: {
      get() {
        return formatLocationInfo(this.location);
      },
      set(newValue: string) {
        if (this.locationNames.includes(newValue)) {
          const matches = newValue.split(' - ');
          return this.$emit('input', { id: `000${matches[0]}`, name: matches[1] });
        }

        return this.$emit('input', {id: newValue, name: ''})
      },
    },
    locationNames() {
      return this.adminLocations.map(formatLocationInfo);
    },
  },
  mixins: [ ValidationMixin ],
  /*
   * Update v-model binding to use property
   * 'location' instead of property 'value.
   * Event binding left as default
   */
  model: {
    event: 'input',
    prop: 'location',
  },
  methods: {
    filterAutocompleteList,
    getErrorMessage() {
      if (!this.$v.location.isValidLocation) {
        return this.$t('roleControl.invalid_location');
      }
      if (!this.$v.location.isAdmin) {
        return this.$t('roleControl.notAnAdmin');
      }
      return 'Unknown Error';
    },
    isInternalAdmin() {
      return isInternalAdminType(this.$store.state.ua.adminType);
    },
  },
  name: 'location-select',
  props: {
    location: { type: Object, default: () => ({name: '', id: ''}), required: true },
  },
  validations() {
    return {
      location: {
        isValidLocation: (inputLoc: LocationData) => this.companyLocations.some((l: LocationData) => {
          return l.id === inputLoc.id;
        }),
        isAdmin: (inputLoc: LocationData) => {
          return this.isInternalAdmin() || this.adminLocations.some((l: LocationData) => {
            return l.id === inputLoc.id;
          });
        },
      },
    }
  },
  watch: {
    '$v.$invalid': function(newValue: boolean) {
      this.$emit('validated', newValue)
    },
    'roleControl.open': function(){
      this.$v.$reset();
    },
  }
};
export default LocationSelect;
</script>
