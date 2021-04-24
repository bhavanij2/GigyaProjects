<template>
  <lmnt-table-wrapper>
    <lmnt-table-top-bar >
      <div slot="title">{{users.length}} {{tableHeader}}</div>
    </lmnt-table-top-bar>
    <lmnt-table sortable-rows>
      <lmnt-table-header :data='users'>
        <lmnt-table-row>
          <lmnt-table-cell v-for="col in cols" :sort-key="col.key" :key="col.key" header-cell sortable>
            {{col.label}}
          </lmnt-table-cell>
          <lmnt-table-cell sort-key="lastLogin" key="lastLogin" header-cell date-time  sortable>
            {{$t('userSearch.lastLogin')}}
          </lmnt-table-cell>
        </lmnt-table-row>
      </lmnt-table-header>
      <lmnt-table-body>
        <lmnt-table-row class="ua-result-table-row" @click="viewUser(user.federationId, user.status)" v-for="(user, i) in paginatedUsers" :key="`${i}_${user.federationId}`">
          <lmnt-table-cell v-for="col in cols" :key="`${user.federationId}_${col.key}`">
            {{user[col.key] | c7mask(APIEnvironment !== 'production' && col.key === 'id')}}
          </lmnt-table-cell>
          <lmnt-table-cell key="lastLogin" date-time>
            {{user.lastLogin | date}}
          </lmnt-table-cell>
        </lmnt-table-row>
      </lmnt-table-body>
    </lmnt-table>
    <lmnt-table-footer>
      <lmnt-pagination :total-items="users.length" :item-per-page="itemPerPage"
        @pageChange="pageChange"/>
    </lmnt-table-footer>
  </lmnt-table-wrapper>
</template>

<script lang="ts">
import { mapState } from 'vuex';
import date from '@/filters/date.filter';
import TablePagination from '@/mixins/table-pagination.mixin';

const cols = [
  { label: 'First Name', key: 'first_name' },
  { label: 'Last Name', key: 'last_name' },
  { label: 'Email', key: 'id' },
  { label: 'Status', key: 'status' },
];

const UserResults = {
  computed: {
    ...mapState('c7', [
      'APIEnvironment',
    ]),
    tableHeader() {
      return this.users.length > 1 ? this.$t('userSearch.pluralTableHeader') : this.$t('userSearch.singleTableHeader');
    },
    paginatedUsers() {
      return this.users.slice(this.firstIndex, this.lastIndex + 1);
    },
  },
  data: () => ({
    cols,
  }),
  filters: { date },
  methods: {
    viewUser(id: string, status: string) {
      if(status !== 'pending'){
        this.$router.push({ name: 'user-profile', params: { id } });
      }
    },
  },
  mixins: [ TablePagination() ],
  name: 'user-results',
  props: {
    users: { type: Array, required: true },
  },
};

export default UserResults;
</script>

<style lang="scss">
.ua-result-table-row {
  cursor: pointer;
}
</style>
