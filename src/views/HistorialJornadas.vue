<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Jornada } from '@/types/jornadas.types';
import Breadcrumb from '@/components/ui/CustomBreadcrumb.vue';
import WorkdayHistoryList from '@/components/Jornadas/WorkdayHistoryList.vue';
import WorkdayDetailsDrawer from '@/components/Jornadas/WorkdayDetailsDrawer.vue';
import jornadasService from '@/api/services/jornadas.service';
import { useNotifications } from '@/componsables/useNotificaciones';

// --- Configuración de la vista ---
const { showError } = useNotifications();

const items = [
  { label: 'Jornadas', route: '/jornadas' },
  { label: 'Historial', route: '/jornadas/historial' },
];

const isDrawerViewOpen = ref<boolean>(false);

const handlViewRequest = async (item: Jornada) => {
  selectedWorkday.value = await getById(item.id);
  if (selectedWorkday.value) {
    isDrawerViewOpen.value = true;
  }
};

// --- Operaciones con la API ---
const workdays = ref<Jornada[]>([]);
const selectedWorkday = ref<Jornada | null>(null);

const getAll = async () => {
  try {
    const res = await jornadasService.getAll();
    workdays.value = res.data;
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const getById = async (id: Jornada['id']) => {
  try {
    const res = await jornadasService.getById(id);
    return res.data;
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

onMounted(async () => {
  await getAll();
});
</script>

<template>
  <div class="flex flex-col">
    <Breadcrumb :items="items" />
    <div class="mt-4 mb-4 flex flex-wrap justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="grid size-9 place-items-center rounded-lg bg-emerald-500 text-lg text-white">
          <i class="fi-sr-calendar"></i>
        </div>
        <h2 class="text-lg font-extrabold dark:text-zinc-200">Historial de jornadas</h2>
      </div>
    </div>
    <WorkdayHistoryList
      :data="workdays"
      @view-details="handlViewRequest"
    />
    <WorkdayDetailsDrawer
      v-model:visible="isDrawerViewOpen"
      :jornada="selectedWorkday"
    />
  </div>
</template>
