<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Menu } from 'primevue';
import type { Usuario } from '@/types/usuarios.types';
import { useAuthStore } from '@/stores/auth.store';
import { getFormattedDate } from '@/utils/formatters';

import authService from '@/api/services/auth.service';
import LogoutDialog from './LogoutDialog.vue';

const router = useRouter();

defineProps<{ isDark: boolean; isCollapsed: boolean }>();
const emit = defineEmits(['toggle-sidebar', 'toggle-dark-mode']);
const authStore = useAuthStore();
const usuario: Usuario = authStore.getData;

const menu = ref<InstanceType<typeof Menu> | null>(null);
const toggleMenu = (event: Event) => {
  menu.value?.toggle(event);
};

const showLogoutDialog = ref(false);

const menuOptions = [
  {
    label: 'Cerrar sesión',
    icon: 'fi-rr-exit',
    class: 'menu-item-danger',
    command: () => {
      showLogoutDialog.value = true;
    },
  },
];

const handleLogout = async () => {
  authStore.logout();
  router.push('/login');
  await authService.logout();
};
</script>

<template>
  <header class="flex items-center justify-between p-2">
    <div class="flex items-center gap-1 rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-700 dark:bg-zinc-900">
      <div class="p-1">
        <Button
          @click="emit('toggle-sidebar')"
          type="button"
          icon="fi-rr-menu-burger"
          severity="secondary"
          class="size-8!"
        ></Button>
      </div>
      <Divider
        layout="vertical"
        class="m-0! self-stretch p-0! before:border-zinc-200! dark:before:border-zinc-700!"
      />
      <div class="p-1">
        <div class="flex items-center justify-center gap-2 px-2 text-sm text-zinc-600 dark:text-zinc-400">
          <i class="fi-sr-calendar-day text-sm! text-zinc-400"></i>
          {{ getFormattedDate() }}
        </div>
      </div>
    </div>
    <div class="flex items-center gap-1 rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-700 dark:bg-zinc-900">
      <div class="p-1">
        <Button
          @click="emit('toggle-dark-mode')"
          type="button"
          :icon="isDark ? 'fi-rr-moon' : 'fi-rr-sun'"
          severity="secondary"
          class="size-8!"
        ></Button>
      </div>
      <Divider
        layout="vertical"
        class="m-0! self-stretch p-0! before:border-zinc-200! dark:before:border-zinc-700!"
      />
      <div class="p-1">
        <Button
          @click="toggleMenu($event)"
          :icon="usuario.rol === 'ADMIN' ? 'fi-sr-admin-alt' : 'fi-sr-user'"
          class="size-8!"
        ></Button>
      </div>
    </div>
  </header>
  <Menu
    ref="menu"
    :popup="true"
    :model="menuOptions"
    class="mt-4! overflow-hidden rounded-lg!"
  >
    <template #start>
      <div class="flex w-full items-center gap-2 border-b border-zinc-200 p-2 dark:border-zinc-700">
        <div class="flex size-8 items-center justify-center rounded-lg bg-emerald-500">
          <i
            class="text-white dark:text-zinc-800"
            :class="usuario.rol === 'ADMIN' ? 'fi-sr-admin-alt' : 'fi-sr-user'"
          ></i>
        </div>
        <div class="flex flex-col">
          <span class="text-sm! font-bold">{{ usuario?.username }}</span>
          <span class="-mt-0.5 text-xs!">{{ usuario?.rol === 'ADMIN' ? 'Administrador' : 'Usuario' }}</span>
        </div>
      </div>
    </template>
  </Menu>

  <LogoutDialog
    v-model:visible="showLogoutDialog"
    @confirmLogout="handleLogout"
  />
</template>
