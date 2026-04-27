import type { Usuario } from '@/types/usuarios.types';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<Usuario | null>(null);

    const isAuthenticated = computed(() => user.value !== null);

    const getData = computed(() => {
      return {
        username: user.value?.username,
        rol: user.value?.rol,
      };
    });

    function setData(userData: Usuario) {
      user.value = userData;
    }

    function logout() {
      user.value = null;
    }

    return { user, isAuthenticated, getData, setData, logout };
  },
  {
    persist: true,
  },
);
