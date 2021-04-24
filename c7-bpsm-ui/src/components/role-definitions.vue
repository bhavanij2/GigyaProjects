<template>
  <lmnt-grid class="c7-role-definitions">
    <!-- Headline -->
    <lmnt-grid-row class="role-definition-header">
      <lmnt-grid-col :phone-col=8 :tablet-col=8 :desktop-col=8>
        <lmnt-typo-headline :level="4" primary>{{$t('roleDefinitions.title')}}</lmnt-typo-headline>
      </lmnt-grid-col>
    </lmnt-grid-row>

      <!-- Print Button -->
    <lmnt-grid-row class="role-definition-print-button">
      <lmnt-grid-col :phone-col=8 :tablet-col=8 :desktop-col=8>
        <lmnt-button tertiary @click="printDefinitions()">
          <lmnt-icon slot="icon" icon="print" />
          <lmnt-typo-caption>{{$t('roleDefinitions.printButton')}}</lmnt-typo-caption>
        </lmnt-button>
      </lmnt-grid-col>
    </lmnt-grid-row>

    <!-- Definition List -->
    <lmnt-grid-row>
      <lmnt-grid-col :phone-col=9 :tablet-col=9 :desktop-col=9>
        <lmnt-list twoLine nonInteractive class="printable">
          <lmnt-list-item class="c7-role-definition-item" v-for="role in adminRoles" :key="role.id">
            <div slot="text">{{role.roleName}} ({{getLob(role.lob)}})</div>
            <div slot="secondaryText" class="c7-role-definition-text">{{role.description}}</div>
          </lmnt-list-item>
          <lmnt-list-divider/>
        </lmnt-list>
      </lmnt-grid-col>
    </lmnt-grid-row>

  </lmnt-grid>
</template>

<script lang="ts">
import { mapState, mapActions } from 'vuex';
import { LOB_MAP } from '../utils/constants';
import { getInternalPermissionContexts, isInternalAdminType } from '../utils/utils';

const RoleDefinitions = {
  computed: {
    ...mapState('ua', [
      'adminRoles',
    ]),
    isInternalAdmin() {
      return this.$store.state.ua.adminType === 'internal';
    },
  },
  mounted() {
    const brand = this.isInternalAdmin ? null : this.$store.state.c7.user.brand;
    const persona = this.isInternalAdmin ? null : this.$store.state.c7.user.userType;
    const identities = isInternalAdminType(this.$store.state.ua.adminType) ?
      getInternalPermissionContexts(this.$store.state.internalEntitlements, '$:uadmin:edit-user:write') :
      [{brand: this.$store.state.c7.user.brand, country: 'US', persona: this.$store.state.c7.user.userType}];
    this.getAdminRoles({
      env: this.$store.state.c7.APIEnvironment,
      identities,
    });
  },
  methods: {
    ...mapActions('ua', [
      'getAdminRoles',
    ]),
    getLob: (lob: string) => LOB_MAP[lob] || 'no lob',
    goBack() {
      this.$router.push({name: 'home'});
    },
    printDefinitions() {
      window.print();
    }
  },
  name: 'role-definitions',
}
export default RoleDefinitions;
</script>

<style lang="scss">
.mdc-layout-grid.c7-role-definitions {
  padding: 80px;

  .role-definition-print-button {
    margin-bottom: 8px;
  }

  .c7-role-definition-item {
    height: 96px;
    padding-left: 36px;
  }

  .c7-role-definition-text {
    white-space: normal;
  }
}
</style>
