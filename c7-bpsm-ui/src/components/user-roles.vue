<template>
  <lmnt-table-wrapper class="ua-roles-table">
    <!-- Start Table -->
    <!-- Table Title -->
    <lmnt-table-top-bar>
      <div slot="title">{{header}}
      </div>
      <lmnt-icon-button slot="actions">
        <lmnt-icon icon="info" @click="viewRoleDefinitions()" />
      </lmnt-icon-button>
      <lmnt-icon-button class="ua-add-role-button" slot="actions" :disabled="addDisabled()" @click.prevent="openRoleControl('add')">
        <lmnt-icon icon="add" />
      </lmnt-icon-button>
    </lmnt-table-top-bar>
    <lmnt-circular-progress indeterminate v-if="rolesTableLoading"/>
    <lmnt-table v-show="!rolesTableLoading" sortable-rows>
      <!-- Table Header Row -->
      <lmnt-table-header :data='roles'>
        <lmnt-table-row>
          <lmnt-table-cell sort-key="locationName" key="locationName" header-cell sortable>
            {{$t('userProfile.locationHeader')}}
          </lmnt-table-cell>
          <lmnt-table-cell sort-key="lobName" key="lobName" header-cell sortable>
            {{$t('userProfile.lobHeader')}}
          </lmnt-table-cell>
          <lmnt-table-cell sort-key="name" key="name" header-cell sortable>
            {{$t('userProfile.roleHeader')}}
          </lmnt-table-cell>
          <lmnt-table-cell><!-- Empty Cell For Actions Column --></lmnt-table-cell>
        </lmnt-table-row>
      </lmnt-table-header>
      <!-- Table Body (Roles) -->
      <lmnt-table-body>
        <lmnt-table-row class="ua-result-table-row" v-for="(role, $index) in paginatedRoles" :key="`${role.locationName}${role.lob}${role.name}`">
          <lmnt-table-cell>
            {{formatSapId(role.location.sapid)}} - {{role.locationName}}
          </lmnt-table-cell>
          <lmnt-table-cell>
            {{role.lobName}}
          </lmnt-table-cell>
          <lmnt-table-cell>
            {{role.name}}
          </lmnt-table-cell>
          <lmnt-table-cell>
            <lmnt-menu-anchor>
              <!-- TODO: Add tooltip for disabled state after element adds it -->
              <lmnt-icon-button :disabled="isKebabButtonDisabled(role)"
                @click="openMenu($index + firstIndex, $event)">
                <lmnt-icon icon="more_vert"/>
              </lmnt-icon-button>
            </lmnt-menu-anchor>
          </lmnt-table-cell>
        </lmnt-table-row>

        <!-- No roles message -->
        <lmnt-table-row v-if="roles.length === 0">
          <lmnt-table-cell class="table-error ua-no-data-state" :colspan="4" >
            <template>
              <c7-icon-with-bg class="c7-critical-error-icon ua-no-role-icon" icon="error_outline" size="sm"/>
              <div>
                <lmnt-typo-headline :level="6">
                  {{$t('roleControl.noRolesHeadline')}}
                </lmnt-typo-headline>
              </div>
              <lmnt-typo-body :level="2" >
                {{$t('roleControl.noRolesBody')}}
              </lmnt-typo-body>
            </template>
          </lmnt-table-cell>
        </lmnt-table-row>
      </lmnt-table-body>
    </lmnt-table>
    <lmnt-table-footer>
      <lmnt-pagination :total-items="roles.length" :item-per-page="itemPerPage"
        @pageChange="pageChange"/>
    </lmnt-table-footer>
    <!-- End Table -->

    <!-- Popup Context Menu -->
    <lmnt-menu iconMenu ref="menu" v-model="isKabobOpen">
      <lmnt-list>
        <lmnt-list-item @click="openRoleControl('edit', selectedRole)">
          <div slot="text">{{$t('roleControl.editButton')}}</div>
        </lmnt-list-item>
        <lmnt-list-item @click="openRoleControl('delete', selectedRole)" :disabled="!isPermitted('$:uadmin:edit-user:?', 'write', selectedRole)">
          <div slot="text">{{$t('roleControl.deleteButton')}}</div>
        </lmnt-list-item>
      </lmnt-list>
    </lmnt-menu>
  </lmnt-table-wrapper>
</template>

<script lang="ts">
import { mapActions, mapState, mapMutations } from 'vuex';

import { EMPTY_ROLE_DATA, LOB_MAP } from '@/utils/constants';
import TablePagination from '@/mixins/table-pagination.mixin';
import HasPermissionMixin from '@/mixins/has-write-permission.mixin';
import { formatSapId ,isAdminAtLocation, isInternalAdminType } from '@/utils/utils';
import { AddUserRole, AdminLocationData, LineOfBusiness, RoleControlContext } from '@/types';

const UserRoles = {
  beforeDestroy() {
    // remove document listener with local callback
    document.removeEventListener('scroll', this.closeMenu);
  },
  computed: {
    ...mapState('ua', [
      'adminRoles',
      'adminLocations',
      'rolesTableLoading',
      'internalEntitlements'
    ]),
    paginatedRoles() {
      return this.roles.slice(this.firstIndex, this.lastIndex + 1);
    },
  },
  data: () => ({
     isKabobOpen: false,
     selectedRole: { ...EMPTY_ROLE_DATA },
  }),
  methods: {
    ...mapActions('ua', [
      'getAdminLocations'
    ]),
    ...mapMutations('ua', [
      'setRoleControlContext',
      'setRoleControlOpen',
      'setRoleControlData',
    ]),
    formatSapId,
    getRoleData(role: AddUserRole) {
      return {
        brand: role.brand,
        country: role.country,
        lob: role.lob,
        location: {
          id: role.location.sapid,
          name: role.location.name,
        },
        persona: role.persona,
        roleName: role.name,
      };
    },
    openMenu(index: number, event: MouseEvent) {
      // set menu open true
      this.isKabobOpen = true;
      // updated selected role
      this.selectedRole = this.getRoleData(this.roles[index]);
      /*
       * This styling is needed because menus dont like to be in tables. Instead
       * the menu is placed outside of the table and positioned based on your click
       * location
       */
      const menu = this.$refs.menu.$el
      const top = event.clientY;
      const left = event.clientX - menu.offsetWidth;
      menu.style = `position: fixed !important; top: ${top}px !important; left: ${left}px !important`;
    },
    openRoleControl(context: RoleControlContext, role = { ...EMPTY_ROLE_DATA }) {
      this.setRoleControlContext(context);
      this.setRoleControlData(role);
      this.setRoleControlOpen(true);
      this.closeMenu();
    },
    closeMenu() {
      this.selectedRole = { ...EMPTY_ROLE_DATA };
      this.isKabobOpen = false;
    },
    isInternalAdmin() {
      return isInternalAdminType(this.$store.state.ua.adminType);
    },
    addDisabled() {
      return this.isInternalAdmin() &&
        (!this.isPermitted('$:uadmin:edit-user:?', 'write') || (!this.companyHq || !this.adminRoles.length));
    },
    isKebabButtonDisabled(role: any) {
      return this.isInternalAdmin() ? 
        !this.isPermitted(`${role.lob}:uadmin:edit-user:?`, 'write', role) :
        !isAdminAtLocation(this.adminLocations, role.location.sapid, role.lob);
    },
    viewRoleDefinitions() {
      const routeData = this.$router.resolve({ name: 'role-definitions' });
      window.open(routeData.href);
    },
  },
  mixins: [ TablePagination(), HasPermissionMixin()],
  mounted() {
    if(!this.isInternalAdmin() && (!this.adminLocations || this.adminLocations.length === 0)) {
      this.getAdminLocations({
        env: this.$store.state.c7.APIEnvironment,
        fedId: this.$store.state.c7.user.federationId,
      });
    }
    /*
     * Because the menu is fixed position due to the issue below,
     * it "sticks" on the screen when you scroll. To resolve this
     * issue, we either had to 1) Do pixel math and use absolute
     * or 2) Close the menu on scroll
     */
    document.addEventListener('scroll', this.closeMenu);
  },
  name: 'user-roles',
  props: {
    companyHq: {type: String, default: ''},
    header: {type: String, default: 'roles'},
    roles: {type: Array, default: () => []},
  }
};

export default UserRoles;
</script>

<style lang="scss">
.ua-roles-table {

  .ua-no-role-icon {
    margin: 0 auto;
    margin-bottom: 28px;
  }

  .ua-result-table-row {
    cursor: default;
  }

  .ua-no-data-state{
    text-align: center;
    padding: 40px;
  }

  // modify visibility of menu to get dimensions for positioning
   .icon.mdc-menu.mdc-menu-container {
     display: block;
     visibility: hidden;
     min-width: 170px;

     &.mdc-menu--open {
       visibility: visible;
     }
   }
}
</style>
