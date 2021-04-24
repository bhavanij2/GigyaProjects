import VueRouter from 'vue-router';
import Home from '@/components/home.vue';
import UserProfile from './components/user-profile/user-profile.vue';
import RoleDefinitions from './components/role-definitions.vue';

const buildRouter = (base: string): VueRouter =>
  new VueRouter({
    base,
    mode: 'history',
    routes: [
      {
        component: Home,
        meta: {
          hasPermission: '$:uadmin:search-user:?',
        },
        name: 'home',
        path: '/admin/home',
      },
      {
        component: RoleDefinitions,
        name: 'role-definitions',
        path: '/admin/roles',
      },
      {
        component: UserProfile,
        meta: {
          hasPermission: '$:uadmin:search-user:?',
        },
        name: 'user-profile',
        path: '/admin/user/:id',
      },
    ],
  });

export default buildRouter;
