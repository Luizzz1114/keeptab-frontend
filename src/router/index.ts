import { createRouter, createWebHistory } from 'vue-router';
import LoginLayout from '@/components/layout/LoginLayout.vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import Login from '@/views/Login.vue';
import Mostrador from '@/views/Mostrador.vue';
import Productos from '@/views/Productos.vue';
import CuentasClaras from '@/views/CuentasClaras.vue';
import Jornadas from '@/views/Jornadas.vue';
import Usuarios from '@/views/Usuarios.vue';
import HistorialJornadas from '@/views/HistorialJornadas.vue';
import { useAuthStore } from '@/stores/auth.store';

const routes = [
  {
    path: '/login',
    name: 'LoginLayout',
    component: LoginLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: Login,
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
        redirect: '/mostrador' 
      },
      {
        path: 'mostrador',
        name: 'Mostrador',
        component: Mostrador,
      },
      {
        path: 'productos',
        name: 'Productos',
        component: Productos,
      },
      {
        path: 'cuentas',
        name: 'CuentasClaras',
        component: CuentasClaras,
      },
      {
        path: 'jornadas',
        children: [
          {
            path: '',
            name: 'Jornadas',
            component: Jornadas,
          },
          {
            path: 'historial',
            name: 'HistorialJornadas',
            component: HistorialJornadas,
          },
        ],
      },
      {
        path: 'usuarios',
        name: 'Usuarios',
        component: Usuarios,
        meta: { roles: ['ADMIN'] },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
	const userData = authStore.getData;
  const isAuthenticated = authStore.isAuthenticated;
  const userRole = userData?.rol;

  if (to.meta.autenticado && !isAuthenticated) {
    return next('/login');
  }
	if (!to.meta.autenticado && isAuthenticated) {
    return next('/mostrador')
	}

  const requiredRoles = to.meta.roles as string[];
  
  if (isAuthenticated && requiredRoles) {
    if (requiredRoles.includes(userRole || '')) {
      next();
    } else {
      next('/mostrador'); 
    }
  } else {
    next();
  }
});

export default router;
