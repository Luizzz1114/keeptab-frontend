import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import LoginLayout from '@/components/layout/LoginLayout.vue';
import MainLayout from '@/components/layout/MainLayout.vue';

const routes = [
  {
    path: '/login',
    name: 'LoginLayout',
    component: LoginLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
      },
    ],
  },
  {
    path: '/',
    name: 'MainLayout',
    component: MainLayout,
    meta: { autenticado: true },
    children: [
      {
        path: '',
        name: 'Placeholder',
        redirect: '/mostrador',
      },
      {
        path: 'mostrador',
        name: 'Mostrador',
        component: () => import('@/views/Mostrador.vue'),
      },
      {
        path: 'productos',
        name: 'Productos',
        component: () => import('@/views/Productos.vue'),
      },
      {
        path: 'cuentas',
        name: 'CuentasClaras',
        component: () => import('@/views/CuentasClaras.vue'),
      },
      {
        path: 'jornadas',
        children: [
          {
            path: '',
            name: 'Jornadas',
            component: () => import('@/views/Jornadas.vue'),
          },
          {
            path: 'historial',
            name: 'HistorialJornadas',
            component: () => import('@/views/HistorialJornadas.vue'),
          },
        ],
      },
      {
        path: 'usuarios',
        name: 'Usuarios',
        meta: { roles: ['ADMIN'] },
        component: () => import('@/views/Usuarios.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  const userData = authStore.getData;
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = userData?.rol;

  if (to.meta.autenticado && !isAuthenticated) {
    return '/login';
  }
  if (!to.meta.autenticado && isAuthenticated) {
    return '/mostrador';
  }

  const requiredRoles = to.meta.roles as string[];

  if (isAuthenticated && requiredRoles) {
    if (!requiredRoles.includes(userRole || '')) {
      return '/mostrador';
    }
  }
});

export default router;
