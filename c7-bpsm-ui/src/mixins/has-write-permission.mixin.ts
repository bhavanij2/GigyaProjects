import { getInternalPermissionsTrie } from '../utils/utils';

const HasPermission = () => ({
  methods: {
    isPermitted(permission: string, type: string = 'write', context: any) {
      const trie = this.$store.state.ua.adminType === 'Internal' ?
        getInternalPermissionsTrie(this.$store.state.ua.internalEntitlements, context) :
        this.$store.state.c7.selectedAccount.entitlements;
      const availablePermissions = trie.permissions(permission);
      if(availablePermissions.includes(type)){
        return true;
      }
      return false;
    },
  }
});

export default HasPermission;
