<template>
  <div class="ua-search-dropdown-container">
    <lmnt-circular-progress class="ua-dropdown-loading" indeterminate v-if="loading"/>
    <c7-input autocomplete secondary v-bind="$attrs"
      :options="options" v-model="displayValue" 
      :filter="filterAutocompleteList" :invalid="invalid"
      :disabled="disabled" />
  </div>
</template>

<script lang="ts">
import { LocationData } from '@/types';
import { formatLocationInfo, filterAutocompleteList } from '@/utils/utils';

const LocationSelector = {
  computed: {
    options() {
      return this.locations.map((l:LocationData) => formatLocationInfo(l));
    },
    displayValue: {
      get(): string {
        return this.value.name !== undefined
          ? formatLocationInfo(this.value)
          : this.value.id;
      },
      set(value: string) {
        if (!value) {
          return this.$emit('input', { id: '', name: undefined }, this.value);
        }
        const matches = value.split(' - ');
        if (matches.length > 1) {
          return this.$emit('input', { id: matches[0], name: matches[1] }, this.value);
        }
        return this.$emit('input', { id: value, name: undefined}, this.value);
      }
    }
  },
  methods: { filterAutocompleteList },
  name: 'location-selector',
  props: {
    disabled: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    locations: { type: Array, default: () => [] },
    value: { type: Object, default: () => ({id: '', name: undefined}) },
  },
};
export default LocationSelector;
</script>