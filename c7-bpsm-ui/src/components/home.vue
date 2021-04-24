<template>

    <lmnt-grid class="c7-usersearch" >

    <!-- Headline -->
    <lmnt-grid-row>
      <lmnt-grid-col :phone-col=8 :tablet-col=8 :desktop-col=8 class="ua-search-headline">
        <lmnt-typo-headline class="user-search-headline" :level="3" primary>
          {{$t('userSearch.title')}}
        </lmnt-typo-headline>
      </lmnt-grid-col>
    </lmnt-grid-row>

    <!-- Tabs -->
    <lmnt-tab-bar ref="tabBar" v-if="isPermitted('$:uadmin:create-user:?', 'write')">
      <lmnt-tab
        v-for="item in items"
        :key="item.display"
        :href="item.href"
        v-model="activeTabIndex"
        :active="item.active"
        @click="updateTab(item.active)"
        class="ua-add-user-tab"
      >
         <lmnt-icon slot="icon" :icon="item.icon"/>
         {{item.display}}
      </lmnt-tab>
    </lmnt-tab-bar>

    <user-search v-if="items[0].active"/>
    <add-user v-if="items[1].active"/>

  </lmnt-grid>
</template>

<script lang="ts">
import { mapActions, mapState, mapMutations } from 'vuex';
import UserSearch from './user-search/user-search.vue';
import AddUser from './add-user.vue';
import HasPermissionMixin from '@/mixins/has-write-permission.mixin';
import { isInternalAdminType, getInternalPermissionContexts } from '@/utils/utils';
import agent from '@/utils/agent';

const Home = {
  components: {
    'add-user': AddUser,
    'user-search': UserSearch,
  },
  computed: {
    isInternalAdmin() {
      return isInternalAdminType(this.$store.state.ua.adminType);
    },
  },
  data() {
    const items = [
      {
        active: true,
        display: 'Search Users',
        href: '/user-search',
        icon: 'search'
      },
      {
        active: false,
        display: 'Add User',
        href: '/add-user',
        icon: 'add',
      }
    ];
    return {
      activeTabIndex: 0,
      items
    };
  },
  methods: {
    ...mapActions('ua', [
      'fetchCompanyHqs',
      'getAdminLocations',
      'getAllCompanyLocations',
      'getAdminRoles',
    ]),
    ...mapMutations('ua', [
      'setHqSapId',
    ]),
    updateTab(isSelected: boolean) {
      if(!isSelected){
        this.items[0].active = !this.items[0].active;
        this.items[1].active = !this.items[1].active;
      }
    },
  },
  mixins: [ HasPermissionMixin() ],
  async mounted() {
    if(this.isInternalAdmin) {
      await this.fetchCompanyHqs({
        env: this.$store.state.c7.APIEnvironment
      });
    } else {
      const adminContext = {
        adminType: this.$store.state.ua.adminType,
        externalToken: this.$store.state.ua.externalToken,
        internalToken: this.$store.state.ua.internalToken
      };
      const identities = isInternalAdminType(this.$store.state.ua.adminType) ?
        getInternalPermissionContexts(this.internalEntitlements, '$:uadmin:edit-user:write') :
        [{brand: this.$store.state.c7.user.brand, country: 'US', persona: this.$store.state.c7.user.userType}];
      const adminRoles = this.getAdminRoles({
        env: this.$store.state.c7.APIEnvironment,
        identities,
      });
      const adminUserInfo = await agent.getUserProfile({
        env: this.$store.state.c7.APIEnvironment,
        fedId: this.$store.state.c7.user.federationId,
      }, adminContext);
      this.setHqSapId(adminUserInfo.profile.hqSapId);

      const companyLocations = this.getAllCompanyLocations({
        env: this.$store.state.c7.APIEnvironment,
        sapAccountId: adminUserInfo.profile.hqSapId,
      });


      const adminLocations = this.getAdminLocations({
        env: this.$store.state.c7.APIEnvironment,
        fedId: this.$store.state.c7.user.federationId,
        hqSapId: adminUserInfo.profile.hqSapId,
        persona: adminUserInfo.profile.persona,
      });
      await Promise.all([adminRoles, companyLocations, adminLocations]);
    }
  },
  name: 'home',
};

export default Home;
</script>

<style lang="scss">
  .ua-search-headline {
    padding-bottom: 40px;
  }

  .primary-header {
    text-align: center;
  }

  .mdc-tab.ua-add-user-tab:not(.mdc-tab--active) .mdc-tab-indicator__content {
    background-color: rgba(0,0,0,.12);
    opacity: 1;
  }
</style>
