import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/components/layout/MainLayout.vue';
import Mostrador from '@/views/Mostrador.vue';
import Productos from '@/views/Productos.vue';
import CuentasClaras from '@/views/CuentasClaras.vue';
import TurnosCaja from '@/views/TurnosCaja.vue';
import Usuarios from '@/views/Usuarios.vue';

const routes = [
  {
    path: '/',
    name: 'MainLayout',
    component: MainLayout,
    children: [
      { 
        path: '',
        name: 'Mostrador',
        redirect: '/mostrador' 
      },
      {
        path: 'mostrador',
        name: 'Mostrador',
        component: Mostrador
      },
      {
        path: 'productos',
        name: 'Productos',
        component: Productos
      },
      {
        path: 'cuentas',
        name: 'CuentasClaras',
        component: CuentasClaras
      },
      {
        path: 'turnos',
        name: 'TurnosCaja',
        component: TurnosCaja
      },
      {
        path: 'usuarios',
        name: 'Usuarios',
        component: Usuarios
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router
