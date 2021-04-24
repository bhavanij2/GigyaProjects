<template>
  <lmnt-grid class="c7-userprofile" >
    <!-- Headline -->
    <lmnt-grid-row class="user-profile-header">
      <lmnt-grid-col :phone-col=8 :tablet-col=8 :desktop-col=8>
        <lmnt-typo-headline :level="3" primary>{{$t('userProfile.title')}}</lmnt-typo-headline>
      </lmnt-grid-col>
    </lmnt-grid-row>

    <!-- Back Link -->
    <lmnt-grid-row class="user-profile-backlink">
      <lmnt-grid-col :phone-col=8 :tablet-col=8 :desktop-col=8>
        <lmnt-button @click="goBack()" tertiary>
          <lmnt-icon slot="icon" icon="chevron_left" />
          <lmnt-typo-caption>{{$t('userProfile.backLink')}}</lmnt-typo-caption>
        </lmnt-button>
      </lmnt-grid-col>
    </lmnt-grid-row>

    <!-- Contact Info -->
    <lmnt-grid-row class="user-profile-contact-info">
      <lmnt-grid-col :phone-col=12 :tablet-col=12 :desktop-col=12>
        <contact-info />
        <hr class="ua-roles-divider">
      </lmnt-grid-col>
    </lmnt-grid-row>

    <!-- Deactivate toggle -->
    <lmnt-grid-row class="user-profile-deactivate-toggle">
      <lmnt-grid-col :phone-col=8 :tablet-col=8 :desktop-col=4>
        <lmnt-card class="ua-status-card" :legacy="false">
          <div class="ua-status-card-content">
            <div class="ua-status-label-container">
              <lmnt-typo-caption>{{$t('userProfile.status')}}</lmnt-typo-caption>
              <lmnt-typo-body :level=1>{{isUserActive ? $t('userProfile.active') : $t('userProfile.inactive')}}</lmnt-typo-body>
            </div>
            <div class="ua-status-switch-container">
              <lmnt-switch :disabled="!isPermitted('$:uadmin:deactivate-user:?', 'write')" v-model="isUserActive" class="ua-status-switch" @change="isDialogOpen = true"/>
            </div>
          </div>
        </lmnt-card>
      </lmnt-grid-col>
    </lmnt-grid-row>

    <!-- Chicken test dialog -->
    <lmnt-dialog v-model="isDialogOpen" @accept="accept" @cancel="cancel" class="ua-dialog-activation">
      <lmnt-typo-headline slot="header" :level="4">{{$t(`userProfile.activationModal.${dialogMessage}Title`)}}</lmnt-typo-headline>
        <lmnt-typo-body slot="body" :level="1">{{$t(`userProfile.activationModal.${dialogMessage}BodyText`)}}</lmnt-typo-body>
        <lmnt-button slot="cancelButton">{{$t(`userProfile.activationModal.cancel`)}}</lmnt-button>
        <lmnt-button slot="acceptButton">{{$t(`userProfile.activationModal.${this.userProfile.profile.status}Button`)}}</lmnt-button>
    </lmnt-dialog>

    <!-- User Roles -->
    <lmnt-grid-row class="user-profile-roles">
      <lmnt-grid-col :phone-col=12 :tablet-col=12 :desktop-col=12>
        <user-roles :roles="roles" :header="tableHeader" :companyHq="this.userProfile.profile.hqSapId" />
      </lmnt-grid-col>
    </lmnt-grid-row>


    <!-- Role Control Modal -->
    <role-control :open="roleControl.open" :roles="this.userProfile.locations" @add="addRole" @delete="deleteRole" @edit="editRole" />

    <c7-snackbar :message="snackbarMessage" :isSnackbarShowing="isSnackbarOpen" @unmountSnackbar="isSnackbarOpen=false"/>
  </lmnt-grid>
</template>

<script lang="ts">
import deline from 'deline';
import { mapActions, mapState, mapMutations } from 'vuex';

import auth from '@/mixins/auth.mixin';
import date from '@/filters/date.filter';

import ContactInfo from './components/contact-info.vue';
import UserRoles from '../user-roles.vue';
import roleControl from '../../components/role-control/role-control.vue';
import HasPermissionMixin from '@/mixins/has-write-permission.mixin';
import { isAdminAtLocation, isInternalAdminType, getInternalPermissionContexts } from '@/utils/utils';
import changeUserStatus from '../../utils/agent';

import { EMPTY_ROLE_DATA, LOB_MAP, INVERSE_LOB_MAP } from '@/utils/constants';

const UserProfile = {
  async beforeMount() {
    await this.getUserProfile({
      env: this.$store.state.c7.APIEnvironment,
      fedId: this.$route.params.id,
    });

    await this.getAdminLocations({
      env: this.$store.state.c7.APIEnvironment,
      fedId: this.$store.state.c7.user.federationId,
      hqSapId: this.userProfile.profile.hqSapId,
      persona: this.userProfile.profile.persona,
    });

    await this.getAllCompanyLocations({
      env: this.$store.state.c7.APIEnvironment,
      sapAccountId: this.userProfile.profile.hqSapId,
    });

    const identities = isInternalAdminType(this.$store.state.ua.adminType) ?
      getInternalPermissionContexts(this.internalEntitlements, '$:uadmin:edit-user:write') :
      [{brand: this.userProfile.profile.brand, country: 'US', persona: this.userProfile.profile.persona}];
    await this.getAdminRoles({
      env: this.$store.state.c7.APIEnvironment,
      identities,
    });
  },
  components: { ContactInfo, UserRoles, roleControl },
  computed: {
    ...mapState('ua', [
      'adminLocations',
      'roleControl',
      'userProfile',
      'internalEntitlements',
    ]),
    tableHeader() {
      return deline`${this.$t('userProfile.tableHeader')}
      ${this.userProfile.profile.first_name}
      ${this.userProfile.profile.last_name}`;
    },
    hasAdminRights() {
      return isInternalAdminType(this.$store.state.ua.adminType) || this.roles.some( (role: any) => {
        return isAdminAtLocation( this.adminLocations, role.location.sapid, role.lob);
        }
      )
    },
    isUserActive: {
      set(value: boolean){
        const newStatus = value ? 'active' : 'inactive';
        this.setUserStatus(newStatus);
      },
      get(){
        return this.userProfile.profile.status === 'active';
      }
    },
    dialogMessage(){
      return this.hasFailed ? 'failed' : this.userProfile.profile.status;
    }
  },
  data: () =>  ({
    hasFailed: false,
    isDialogOpen: false,
    isSnackbarOpen: false,
    roles: [],
    snackbarMessage: '',
  }),
  methods: {
    ...mapActions('ua', [
      'changeUserStatus',
      'getAdminRoles',
      'getUserProfile',
      'editUserRole',
      'grantUserNewRole',
      'removeUserRole',
      'getAdminLocations',
      'getAllCompanyLocations',
    ]),
    ...mapMutations('ua', [
      'setRolesTableLoading',
      'setUserStatus',
    ]),
    goBack() {
      this.$router.push({name: 'home'});
    },
    async addRole(payload: any) {
      try {
        await this.grantUserNewRole(payload);
        await this.succeed(this.roleControl.context);
      } catch (err) {
        console.error(err);
        this.fail(this.roleControl.context);
      }
    },
    async editRole(payload:any) {
      try {
        const { role, ...config } = payload;
        const { roleName, lob } = this.roleControl.role;
        await this.editUserRole({
          ...config,
          newRole: role,
          oldRole: { roleName, lob, locationId: this.roleControl.role.location.id },
        });
        await this.succeed(this.roleControl.context);
      } catch (err) {
        console.error(err);
        this.fail(this.roleControl.context);
      }
    },
    async deleteRole(payload:any) {
      try {
        await this.removeUserRole(payload);
        await this.succeed(this.roleControl.context);
      } catch (err) {
        console.error(err);
        this.fail(this.roleControl.context);
      }
    },
    async succeed(context: any) {
      await this.getUserProfile({
        env: this.$store.state.c7.APIEnvironment,
        fedId: this.$route.params.id,
      });
      this.setRolesTableLoading(false);
      this.snackbarMessage=this.$t(`userProfile.snackbar.${context}`);
      this.isSnackbarOpen=true;
    },
    fail(context: any) {
      this.snackbarMessage=this.$t(`userProfile.snackbar.${context}Fail`);
      this.setRolesTableLoading(false);
      this.isSnackbarOpen=true;
    },
    async accept() {
      const payload = {
        brand: this.userProfile.profile.brand,
        env: this.$store.state.c7.APIEnvironment,
        federationId: this.$route.params.id,
        persona: this.userProfile.profile.persona,
        status: this.isUserActive ? 'active' : 'inactive',
        userId: this.userProfile.profile.id,
      };
      try {
        await this.changeUserStatus(payload);
        this.isDialogOpen = false;
        this.snackbarMessage = this.isUserActive ?
          this.$t('userProfile.snackbar.activate') :
          this.$t('userProfile.snackbar.deactivate');
        this.isSnackbarOpen = true;
        this.hasFailed = false;
      } catch (err) {
        console.error(err);
        this.hasFailed = true;
        this.isDialogOpen = true;
      }
    },
    cancel() {
      this.isDialogOpen = false;
      this.isUserActive = !this.isUserActive;
      this.hasFailed = false;
    },
  },
  mixins: [auth, HasPermissionMixin()],
  name: 'user-search',
    watch: {
    /*
     * Using watcher for locations instead of
     * computed because the table can be sorted.
     */
    /* tslint:disable-next-line */
    'userProfile.locations': function(newLocations: object) {
      this.roles = [];
      for(const sapId in newLocations) {
        const locRoles = newLocations[sapId].roles;
        for(const roleId in locRoles) {
          const role = locRoles[roleId];
          this.roles.push({
            ...role,
            id: roleId,
            lobName: LOB_MAP[role.lob],
            location: newLocations[sapId],
            locationName: newLocations[sapId].name,
          });
        }
      }
    }
  }
};

export default UserProfile;
</script>

<style lang="scss">
.mdc-layout-grid.c7-userprofile {
  padding: 80px;

  .user-profile-header {
    margin-bottom: 28px;
  }

  .user-profile-backlink,
  .user-profile-contact-info,
  .user-profile-deactivate-toggle {
    margin-bottom: 40px;
  }
}

.ua-status-card {
  .ua-status-card-content {
    padding: 14px 24px;
  }

  .ua-status-label-container {
    width: 50%;
    float: left;

    span {
      display: block;
    }
  }

  .ua-status-switch-container {
    width: 50%;
    float: right;
    padding: 10px 0;

    .ua-status-switch {
      float: right;
    }

    .mdc-switch {
      padding: 2px 0;
    }
  }
}

.ua-dialog-activation .mdc-dialog__body {
  margin-top: 35px;
}

</style>
