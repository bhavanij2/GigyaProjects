<template>
  <!-- Headline -->
  <div>
    <form @keyup.enter="trySubmit" class="ua-form">
      <lmnt-grid-row>
        <lmnt-grid-col :phone-col=4 :tablet-col=4 :desktop-col=5>
          <lmnt-typo-body :level="1">
            {{$t('addUser.description')}}
          </lmnt-typo-body>
        </lmnt-grid-col>
      </lmnt-grid-row>
      <lmnt-grid-row>
        <lmnt-grid-col :phone-col=4 :tablet-col=4 :desktop-col=5 class="ua-add-user-overline-col">
          <lmnt-typo-headline :level=6>{{$t('addUser.overline')}}</lmnt-typo-headline>
        </lmnt-grid-col>
      </lmnt-grid-row>

      <!-- Add Form - Row 1  - firstname and email-->
      <!-- Fields will not display correctly without the .$model at the end of the v-model because validation is nested -->
      <lmnt-grid-row class="ua-form-row ua-form-row-first">
        <lmnt-grid-col :phone-col=4 :tablet-col=4 :desktop-col=5>
          <c7-input class="ua-form-text-field" :invalid="$v.formData.firstName.$error" :label="$t('addUser.firstName')" :message="$t('addUser.invalid_firstName')" tabindex="1" v-model="$v.formData.firstName.$model" :disabled="!isPermitted('$:uadmin:create-user:?')"/>
        </lmnt-grid-col>
        <lmnt-grid-col class="ua-form-col2 email-container" :phone-col=4 :tablet-col=4 :desktop-col=5>
          <lmnt-circular-progress class="ua-email-loading" indeterminate v-if="emailValidating"/>
          <c7-input class="ua-form-text-field" :label="$t('addUser.email')" :message="getEmailErrorMessage()"
            :invalid="$v.formData.email.$error" tabindex="4" @input="updateField($event)" :value="formData.email"
            :disabled="emailValidating || !isPermitted('$:uadmin:create-user:?')" ref="email"/>
        </lmnt-grid-col>
      </lmnt-grid-row>

      <!-- Add Form - Row 2  - lastName and confirm email-->
      <lmnt-grid-row class="ua-form-row ua-form-row">
        <lmnt-grid-col :phone-col=4 :tablet-col=4 :desktop-col=5>
          <c7-input class="ua-form-text-field" :label="$t('addUser.lastName')" :message="$t('addUser.invalid_lastName')"
            :invalid="$v.formData.lastName.$error" tabindex="2" v-model="$v.formData.lastName.$model" :disabled="!isPermitted('$:uadmin:create-user:?')"/>
        </lmnt-grid-col>
        <lmnt-grid-col class="ua-form-col2" :phone-col=4 :tablet-col=4 :desktop-col=5>
          <!-- TODO: Disabled Copy/Paste? -->
          <c7-input class="ua-form-text-field" :label="$t('addUser.confirmEmail')" :message="$t('addUser.invalid_confirm_email')"
            :invalid="$v.formData.confirmEmail.$error" tabindex="5" v-model.trim="$v.formData.confirmEmail.$model" :disabled="!isPermitted('$:uadmin:create-user:?')" onpaste="return false"/>
        </lmnt-grid-col>
      </lmnt-grid-row>

      <!-- Add Form - Row 3 (INTERNAL ONLY) - hq autocomplete select -->
      <lmnt-grid-row  v-if="isInternalAdmin()" class="ua-form-row ua-form-row">
        <lmnt-grid-col :phone-col=4 :tablet-col=4 :desktop-col=5>
          <LocationSelector class="ua-form-text-field"  :label="$t('roleControl.companyHq')"
            :locations="companyHqs" v-model="companyHq" :disabled="isDisabledCompanyHq" tabindex="3" :invalid="false"
            @input="updateCompanyLocations" />
        </lmnt-grid-col>

      </lmnt-grid-row>
      <lmnt-grid-row  v-if="isInternalAdmin()" class="ua-form-row ua-form-row">
        <lmnt-grid-col :phone-col=4 :tablet-col=4 :desktop-col=5>
          <c7-input @input="updateAdminRoles" autocomplete secondary class="ua-form-text-field" :label="$t('addUser.brand')" tabindex="6" 
            v-model="formData.brand" :invalid="$v.formData.brand.$error" :options="brands" :disabled="isDisabledCompanyHq" />
        </lmnt-grid-col>
        <lmnt-grid-col class="ua-form-col2" :phone-col=4 :tablet-col=4 :desktop-col=5>
          <c7-input @input="updateAdminRolesAndCompanies" autocomplete secondary class="ua-form-text-field" :label="$t('addUser.persona')" tabindex="7" 
            v-model="formData.persona" :invalid="$v.formData.brand.$error" :options="personas" :disabled="isDisabledCompanyHq || !formData.brand" />
        </lmnt-grid-col>
      </lmnt-grid-row>
    </form>

    <hr class="ua-add-role-form-divider mdc-list-divider">

    <!-- Roles Table -->
    <user-roles :roles="roles" :header="tableHeader" :companyHq="this.companyHq.id" />

    <!-- Role Control Modal -->

    <role-control :open="roleControl.open" @add="addRole" @delete="deleteRole" @edit="editRole" :roles="groupRoles"/>

    <!-- Form Actions/Submit Buttons-->
    <lmnt-grid-row class="ua-form-row">
      <lmnt-grid-col :phone-col=12 :tablet-col=12 :desktop-col=12 class="ua-add-role-buttons">
        <lmnt-button tabindex="8" @click="isClearModalOpen=true">{{$t('addUser.clear')}}</lmnt-button>
        <lmnt-button tabindex="9" @click="trySubmit" primary :disabled="submitDisabled || !isPermitted('$:uadmin:create-user:?') ">{{$t('addUser.createUser')}}</lmnt-button>
      </lmnt-grid-col>
    </lmnt-grid-row>

    <!-- Clear Data Modal -->
    <clear-data-modal :open="isClearModalOpen" @acceptClearData="clearData" @clearAllModalClosed="isClearModalOpen = false"/>

    <c7-snackbar :message="snackbarMessage" :isSnackbarShowing="isSnackbarOpen" @unmountSnackbar="isSnackbarOpen=false"/>

  </div>
</template>

<script lang="ts">
import { mapActions, mapMutations, mapState } from 'vuex';
import { isEqual, groupBy, debounce } from 'lodash';
import ClearDataModal from './clear-data-modal.vue';
import UserRoles from './user-roles.vue';
import RoleControl from './role-control/role-control.vue';
import LocationSelector from '@/components/global/location-selector';
import { append } from 'domutils';
import { LOB_MAP } from '@/utils/constants';
import { isInternalAdminType, filterAutocompleteList, getInternalPermissionContexts } from '@/utils/utils';
import auth from '@/mixins/auth.mixin';

import { email, minLength, required, sameAs } from 'vuelidate/lib/validators';
import ValidationMixin from '@/mixins/validation.mixin';
import HasPermissionMixin from '@/mixins/has-write-permission.mixin';
import { AdminLocationData, AddUserRole, LocationData } from '../types';

const emptyFormData = {
  confirmEmail: '',
  email: '',
  firstName: '',
  lastName: '',
};

const formatRole = (payload:any) => {
  const role = {
    id: payload.role.roleId,
    lob: payload.role.lob,
    lobName: LOB_MAP[payload.role.lob],
    location: {
      name: payload.role.locationName,
      sapid: payload.role.locationId,
    },
    locationName: payload.role.locationName,
    name: payload.role.roleName,
  };
  return role;
};

const AddUser = {
  components: {
    LocationSelector,
    'clear-data-modal':ClearDataModal,
    'role-control': RoleControl,
    'user-roles': UserRoles,
  },
  computed: {
    ...mapState('ua', [
      'adminLocations',
      'internalEntitlements',
      'companyHqs',
      'roleControl',
    ]),
    contexts() {
      return this.isInternalAdmin() ?
        getInternalPermissionContexts(this.internalEntitlements, '$:uadmin:create-user:write') :
        [];
    },
    brands() {
      return this.contexts
        .map((c:any) => c.brand)
        .filter((c: string, index: number, self: string[]) => self.indexOf(c) === index);
    },
    personas() {
      if (!this.formData.brand) { return []; }
      return this.contexts
        .filter((c:any) => c.brand === this.formData.brand)
        .map((c:any) => c.persona)
        .filter((c: string, index: number, self: string[]) => self.indexOf(c) === index);
    },
    tableHeader() {
      return `${this.$t('addUser.tableHeader')}`;
    },
    submitDisabled() {
      return !this.roles.length || this.$v.$invalid || this.pending;
    },
    groupRoles() {
      const groupedLocations = groupBy(this.roles, role => role.location.sapid);
      const structuredRoles = {};
      for(const key in groupedLocations){
        const roles = groupedLocations[key];
        const map = {};
        for( const i in roles ){
          map[i] = {
            lob: roles[i].lob,
            name: roles[i].name,
          };
        }
        structuredRoles[key] = {
          roles: map
        };
      }
      return structuredRoles;
    },
    isDisabledCompanyHq() {
      return this.roles && this.roles.length > 0;
    }
  },
  data: () => ({
    companyHq: { id: '', name: undefined },
    emailAvailable: false,
    emailValidating: false,
    error: false,
    formData: {...emptyFormData},
    isClearModalOpen: false,
    isSnackbarOpen: false,
    loading: false,
    pending: true,
    roles: [],
    snackbarMessage: '',
  }),
  methods: {
    ...mapMutations('ua', [
      'resetCompanyLocations',
      'setAdminRoles',
      'setRolesTableLoading',
      'setRoleControlData',
    ]),
    ...mapActions('ua', [
      'checkEmailAvailability',
      'getAdminRoles',
      'getLocationInfo',
      'preregister',
      'getAdminLocations',
      'getAllCompanyLocations',
    ]),
    addRole(payload:any){
      const role = formatRole(payload);
      this.roles.push(role);
      this.finishSubmission();
    },
    clearData(){
      this.formData = {...emptyFormData};
      this.$v.formData.$reset();
      [ this.loading, this.error ] = [ false, false ];
      this.isClearModalOpen = false;
      this.roles = [];
      this.snackbarMessage = this.$t('addUser.snackbar.clear');
      this.isSnackbarOpen = true;
      this.companyHq = { id: '', name: undefined };
    },
    deleteRole(payload: any){
      const role = formatRole(payload);
      const roleToRemove = this.roles.findIndex((r: any) => isEqual(role, r));
      this.roles.splice(roleToRemove, 1);
      this.finishSubmission();
    },
    editRole(payload: any){
      const newRole = formatRole(payload);
      const storeRoleControl = this.roleControl;
      const initialRole = formatRole(storeRoleControl);
      const roleToRemove = this.roles.findIndex((r: any) => isEqual(initialRole, r));
      this.roles.splice(roleToRemove, 1);
      this.roles.push(newRole);
      this.finishSubmission();
    },
    filterAutocompleteList,
    isInternalAdmin() {
      return isInternalAdminType(this.$store.state.ua.adminType);
    },
    finishSubmission(){
      this.snackbarMessage=this.$t(`addUser.snackbar.${this.roleControl.context}`);
      this.isSnackbarOpen=true;
      this.setRolesTableLoading(false);
    },
    getEmailErrorMessage() {
      if (!this.$v.formData.email.isRequired) {
        return this.$t('addUser.email_required');
      }

      if (!this.$v.formData.email.isValidEmail) {
        return this.$t('addUser.invalid_email');
      }

      if (!this.$v.formData.email.isAvailable) {
        return this.$t('addUser.email_already_exists')
      }

      return 'Unknown Error';
    },
    async getLocationRoles(roles: AddUserRole[], hqSapId: string) {
      try {
        const roleMap: any = roles.map(async (role: any) => {
          const locInfoForOneRole = await this.getLocationInfo({
            env: this.$store.state.c7.APIEnvironment,
            sapAccountId: role.location.sapid
          });
          return {
            location: {
              hqSapId,
              sapId: role.location.sapid,
              sapLocationCity: locInfoForOneRole.city,
              sapLocationName: locInfoForOneRole.locationName,
              sapLocationState: locInfoForOneRole.state
            },
            role: { roleId: role.id },
          }
        });
        return Promise.all(roleMap);
      } catch (err) {
        console.error('There was an error getting location data', err)
      }
    },
    async trySubmit() {
      if (!this.$v.invalid){
        try {
          const { confirmEmail, ...formData} = this.formData;
          // todo: hqsapid to store?

          const locInfo = await this.getLocationInfo({
            env: this.$store.state.c7.APIEnvironment,
            sapAccountId: this.isInternalAdmin()
              ? this.companyHq.id
              : this.$store.state.c7.selectedAccount.sapAccountId,
          });
          const locationRoles = await this.getLocationRoles(this.roles, locInfo.hqSapId);
          /* tslint:disable object-literal-sort-keys */
          await this.preregister({
            brand: this.isInternalAdmin() ? this.formData.brand : this.$store.state.c7.user.brand,
            env: this.$store.state.c7.APIEnvironment,
            hqSapId: locInfo.hqSapId,
            userType: this.isInternalAdmin() ? this.formData.persona : this.$store.state.c7.user.userType,
            ...this.formData,
            locationRoles,
          });
          this.clearData();
          this.snackbarMessage=this.$t('addUser.snackbar.userCreated');
        } catch (err) {
          this.snackbarMessage=this.$t('addUser.snackbar.userNotCreated');
          console.error('error occured while attempting to preregister', err);
        } finally {
          this.isSnackbarOpen=true;
        }
      }
    },
    throttleValidation: debounce(async function() {
      this.emailValidating = true;
      try {
        if(!this.formData.email){
          return this.emailAvailable = true;
        }
        this.emailAvailable = await this.checkEmailAvailability({
          brand: this.$store.state.c7.user.brand,
          env: this.$store.state.c7.APIEnvironment,
          userId: this.formData.email,
          userType: this.$store.state.c7.user.userType,
        });
      } catch (e) {
        this.emailAvailable = false;
        console.error('error occurred while fetching email availability');
      } finally {
        this.emailValidating = false;
        this.pending = false;
        if (this.$v.formData.email.$invalid) {
          // reset focus
          const input = this.$refs.email.$refs.input.$el.firstElementChild;
          this.$nextTick(() => input.focus());
        }
      }
    }, 750),
    updateField(event: string) {
      this.$v.formData.email.$model = event;
      this.emailAvailable = true;
      this.pending = true;
      this.throttleValidation();
    },
    async updateAdminRoles() {
      if (!this.formData.brand || !this.formData.persona) {
        return this.setAdminRoles([]);
      }
      await this.getAdminRoles({
        env: this.$store.state.c7.APIEnvironment,
        identities: [{brand: this.formData.brand, country: 'US', persona: this.formData.persona}],
      });
    },
    async updateAdminRolesAndCompanies() {
      if(this.companyHq.id) {
          this.getAdminLocations({
            env: this.$store.state.c7.APIEnvironment,
            fedId: this.$store.state.c7.user.federationId,
            hqSapId: this.companyHq.id,
            persona: this.formData.persona,
          });
      }
      this.updateAdminRoles();
    },
    async updateCompanyLocations(value: LocationData, old: LocationData) {
      if(value.id !== old.id) {
        if(this.companyHqs.find((c:LocationData) => c.id === `000${value.id}`)) {
          this.getAdminLocations({
            env: this.$store.state.c7.APIEnvironment,
            fedId: this.$store.state.c7.user.federationId,
            hqSapId: this.companyHq.id,
            persona: this.formData.persona
          });

          this.getAllCompanyLocations({
            env: this.$store.state.c7.APIEnvironment,
            sapAccountId: this.companyHq.id,
          });
        } else {
          this.resetCompanyLocations();
        }
      }
    },
  },
  mixins: [auth, ValidationMixin, HasPermissionMixin()],
  name: 'add-user',
  validations() {
    return {
      formData: {
        brand: {
          isRequired: this.isInternalAdmin() ? required : true,
        },
        confirmEmail: {
          sameAsEmail: sameAs('email')
        },
        email: {
          isAvailable:  () => this.emailAvailable,
          isRequired: required,
          isValidEmail: email,
        },
        firstName: {
          isRequired: required
        },
        lastName: {
          isRequired: required
        },
        persona: {
          isRequired: this.isInternalAdmin() ? required : true
        },
      },
    };
  },
};

export default AddUser;
</script>

<style lang="scss">

.mdc-layout-grid.c7-usersearch {

  .email-container {
    position: relative;
  }

  .ua-email-loading {
    position: absolute;
    right: 10px;
    top: 10px;
    height: 36px;
    width: 36px;
  }

  .ua-add-user-overline-col{
    margin-top: 40px;
  }

  .ua-add-role-buttons {
    margin-top: 24px;
  }

  @media (min-width: 840px) {
    .ua-form-col2 {
      grid-column-start: 7;
    }
  }

  .ua-help-text, .helptext {
    padding-top: 4px;
    margin-bottom: 0;
  }

  .ua-add-role-form-divider {
    margin: 24px 0 0;
    margin-bottom: 48px;
  }

  .ua-results-table, .ua-error {
    margin-top: 64px;
  }

  .c7-assistive-text {
    opacity: .37 !important;
  }
}
</style>

