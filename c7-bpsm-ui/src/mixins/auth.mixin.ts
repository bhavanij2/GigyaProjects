import { getInternalPermissionsTrie } from '@/utils/utils';

const auth = {
  methods: {
    $_isRoutePermitted() {
      const permission = this.$_getRoutePermission();
      if (permission) {
        this.$_isPermitted(permission);
      }
    },
    $_isPermitted(permission: string) {
      let error = true;
      try {
        if (this.$store.state.ua.adminType === 'Internal') {
          const trie = getInternalPermissionsTrie(this.$store.state.ua.internalEntitlements);
          error = trie.permissions(permission).length === 0;
        } else {
          error = this.$store.state.c7.selectedAccount.entitlements.permissions(permission).length === 0;
        }
      } catch {
        error = true;
      }

      if (error) {
        this.$router.push({name: 'c7-access-denied'});
      }
    },
    $_getRoutePermission() {
      return this.$route.matched.some((record: any) => record.meta.hasPermission)
        ? this.$route.meta.hasPermission : false;
    },
  },
  mounted() {
    this.$_isRoutePermitted();
  },
};

export default auth;
