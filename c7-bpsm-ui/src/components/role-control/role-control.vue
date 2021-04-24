<template>
  <div class="ua-role-control">
    <lmnt-dialog :open="open" @change="setRoleControlOpen(!roleControl.open)"
      @accept="triggerSubmission" @cancel="dismiss" class="role-control-modal" ref="role-control">
      <!-- Headline -->
      <lmnt-typo-headline class="ua-role-definition-header" :level="6" slot="header" primary>
        {{ title }}
        <div @click="viewRoleDefinitions()" v-if="roleControl.context !== 'delete'" class="ua-role-definition-link">
          <lmnt-typo-body :level="2"> {{ $t('roleControl.roleDefinitionLink') }} </lmnt-typo-body>
        </div>
      </lmnt-typo-headline>

      <!-- Body -->
      <template v-if="roleControl.context === 'delete'" class="delete-body" slot="body">
        <lmnt-typo-body :level=2 class="ua-delete-role-body">{{deleteBodyMessage}}</lmnt-typo-body>
      </template>

      <!-- Edit Body -->
      <template v-else slot="body">
        <!-- Location Select -->
        <!-- TODO: Use global loc selector -->
        <location-select ref="location" v-model="location" @validated="onLocationValidated($event)"/>

        <!-- LOB Select -->
        <c7-input autocomplete class="ua-role-control-text-field" :disabled="locationInvalid" :label="$t('roleControl.lob')" v-model="lob" :message="getLobErrorMessage()" :options="lobNames" outlined @input="validateField('lob')" :invalid="$v.lob.$error">
        </c7-input>

        <!-- Role Select -->
        <c7-input autocomplete class="ua-role-control-text-field" :disabled="locationInvalid || !this.lob" :label="$t('roleControl.role')" v-model="selectedRole" :message="getRoleErrorMessage()" :options="adminRoleNames" outlined @input="validateField('role')" :invalid="$v.role.$error">
        </c7-input>
        <div class="ua-role-description">
          <lmnt-typo-body v-if="role.description" :level="2" >{{role.description}}</lmnt-typo-body>
        </div>
      </template>

      <!-- Actions -->
      <lmnt-button slot="cancelButton" class="cancel-button">
        {{ $t('roleControl.cancel') }}
      </lmnt-button>

      <lmnt-button slot="acceptButton" class="submit-button" :disabled="($v.$invalid && roleControl.context !== 'delete') || !isPermitted('$:uadmin:edit-user:?')">
        {{ $t('roleControl.submit') }}
      </lmnt-button>
    </lmnt-dialog>
  </div>
</template>

<script lang="ts">
import deline from 'deline';
import { mapState, mapMutations, mapActions } from 'vuex';
import { requiredIf } from 'vuelidate/lib/validators';
import { AdminLocationData } from '@/types';
import { getInternalPermissionProperty } from '@/utils/utils';
import { EMPTY_ROLE_DATA, LOB_MAP, INVERSE_LOB_MAP } from '@/utils/constants';
import ValidationMixin from '@/mixins/validation.mixin';
import HasPermissionMixin from '@/mixins/has-write-permission.mixin';
import LocationSelect from './location-select.vue';

const roleControl = {
  components: {
    LocationSelect,
  },
  computed: {
    ...mapState('ua', [
      'adminLocations',
      'adminRoles',
      'adminType',
      'internalEntitlements',
      'roleControl',
      'userProfile',
    ]),
    deleteBodyMessage() {
      const { lob, roleName, location } = this.roleControl.role;
      return deline`${this.$t('roleControl.deleteBodyMessage')} ${LOB_MAP[lob]} Business,
      ${roleName} role, for ${location.name}?`;
    },
    lobNames() {
      const lobAccess = this.adminType === 'Internal' ? 
        getInternalPermissionProperty(this.internalEntitlements, 'lob', '$:uadmin:edit-user:write')
        : Object.keys(LOB_MAP);
      const adminLocation = this.adminLocations.find( (l: AdminLocationData) => l.id === this.location.id);
      if(adminLocation){
        return adminLocation.lob.filter((l: string) => lobAccess.includes(l)).map((lob: string) => LOB_MAP[lob]);
      }
      return [];
    },
    adminRoleNames() {
      return this.lob ? this.adminRoles
        .filter((r:any) => r.lob === INVERSE_LOB_MAP[this.lob])
        .map((r:any) => r.roleName) : [];
    },
    title() {
      return this.$t(`roleControl.${this.roleControl.context}Title`);
    },
    selectedRole: {
      get() {
        return this.role ? this.role.roleName : '';
      },
      set(value: string) {
        return this.role = this.adminRoles.find((r:any) => r.roleName === value) || {};
      },
    }
  },
  data: () => ({
    lob: '',
    location: {},
    locationInvalid: true,
    role: () => ({ roleName: undefined, lob: undefined }),
  }),
  methods: {
    ...mapMutations('ua', [
      'setRoleControlData',
      'setRoleControlOpen',
      'setRolesTableLoading',
    ]),
    dismiss() {
      [ this.lob, this.role, this.location ] = ['', '', {}];
      this.setRoleControlOpen(false);
      this.setRoleControlData({ ...EMPTY_ROLE_DATA });
    },
    getLobErrorMessage() {
      if (!this.$v.lob.isValid) {
        return this.$t('roleControl.invalid_lob');
      }
      if (!this.$v.lob.isAdmin) {
        return this.$t('roleControl.notAnAdminLob');
      }
      return 'Unknown Error';
    },
    getRoleErrorMessage() {
      if (!this.$v.role.isValid) {
        return this.$t('roleControl.invalid_role');
      }
      if (!this.$v.role.isNotDuplicate) {
        return this.$t('roleControl.duplicateRole');
      }
      return 'Unknown Error';
    },
    onLocationValidated(event: boolean) {
      this.locationInvalid = event;
      // if location has been set to invalid then we reset the form
      if(event){
        this.lob = '';
        this.role = '';
        this.$v.$reset();
      }
    },
    triggerSubmission() {
      this.setRolesTableLoading(true);
      const payload = {
        env: this.$store.state.c7.APIEnvironment,
        fedId: this.$route.params.id,
        role: {
          lob: INVERSE_LOB_MAP[this.lob],
          locationId: this.location.id,
          locationName: this.location.name,
          roleId: this.role.roleId,
          roleName: this.role.roleName,
        },
      };
      this.$emit(this.roleControl.context, payload);
      this.dismiss();
    },
    viewRoleDefinitions() {
      this.dismiss();
      const routeData = this.$router.resolve({ name: 'role-definitions' });
      window.open(routeData.href);
    },
  },
  mixins: [ ValidationMixin, HasPermissionMixin()],
  name: 'role-control',
  props: {
    open: { type: Boolean, default: false },
    roles: { type: Object, default: () => ({}) },
  },
  watch: {
    open(oldValue: boolean, newValue: boolean) {
      this.lob = LOB_MAP[this.roleControl.role.lob];
      this.role = this.roleControl.role;
      this.location = this.roleControl.role.location;
      if(this.roleControl.context === 'edit') {
        this.locationInvalid = false;
      }
      this.$v.$reset();
    },
  },
  validations() {
    return {
      lob: {
        isAdmin: (lob: string) => this.lobNames.includes(lob),
        isValid: (lob: string) => !!INVERSE_LOB_MAP[lob],
      },
      location: {
        isValid: () => !this.locationInvalid
      },
      role: {
        isNotDuplicate: () => {
          const location = this.roles[this.location.id];
          if(!location){
            return true;
          };

          for( const key in location.roles ){
            const role = location.roles[key];
            if (INVERSE_LOB_MAP[this.lob] === role.lob && this.role.roleName === role.name) {
              return false;
            }
          }
          return true;
        },
        isValid: (role: any) => this.adminRoleNames.includes(role.roleName)
      }
    }
  }
};

export default roleControl;
</script>

<style lang="scss">
.ua-role-control-text-field {

  // TODO: Align styling when other fields match HTML structure
  &.c7-textfield-container {
    margin: 8px 0 28px;
    .mdc-text-field, .mdc-text-field, .mdc-select, .mdc-autocomplete-container, .mdc-text-field--upgraded:not(.mdc-text-field--fullwidth):not(.mdc-text-field--box){
      margin: 0;
      width: 100%;
    }
  }
}

.role-control-modal {
  section {
    margin-top: 35px;
    padding-bottom: 16px;
  }
}

.ua-delete-role-body{
  margin: 35px 0 0;
}

.ua-role-definition-header {
  width: 100%;
}

.ua-role-description{
  height: 55px;
  margin-top: 16px;
  padding-bottom: 24px;
}

.ua-role-definition-link {
  float: right;
  cursor: pointer;
  &:hover {
    text-decoration: underline
  }
}

</style>
