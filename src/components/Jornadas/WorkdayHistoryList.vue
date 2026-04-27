<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Menu } from 'primevue';
import type { Jornada } from '@/types/jornadas.types';
import { formatCurrency, formatTinyDate } from '@/utils/formatters';

// --- 1. Props y Emits ---
const props = defineProps<{ data?: Jornada[] }>();
const emit = defineEmits<{ (e: 'view-details', jornada: Jornada): void }>();

// --- 2. Estado (Refs) ---
const searchQuery = ref<string>('');
const menu = ref<InstanceType<typeof Menu> | null>(null);
const selectedItem = ref<Jornada | null>(null);
const rows = ref<number>(5);

// --- 3. Propiedades Computadas ---
const filteredData = computed(() => {
  if (!searchQuery.value || !props.data) return props.data;
  const query = searchQuery.value.toLowerCase();
  return props.data.filter(
    (item) => String(item.id).includes(query) || (item.estatus || '').toLowerCase().includes(query),
  );
});

const menuOptions = computed(() => [
  {
    label: 'Ver detalles',
    icon: 'fi-rr-eye',
    command: () => emit('view-details', selectedItem.value!),
  },
]);

// --- 4. Métodos ---
const toggleMenu = (event: Event, item: Jornada) => {
  selectedItem.value = item;
  menu.value?.toggle(event);
};
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 shadow-xs dark:border-zinc-700 dark:bg-zinc-950/50">
    <DataView
      :value="filteredData"
      layout="grid"
      :rows="rows"
      paginator
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <IconField>
            <InputIcon>
              <i class="fi-rr-search"></i>
            </InputIcon>
            <InputText
              id="buscador"
              v-model="searchQuery"
              placeholder="Buscar por ID o estatus"
              size="small"
              class="h-9! w-full sm:max-w-64"
              autocomplete="off"
            />
          </IconField>
        </div>
      </template>

      <template #paginatorcontainer="{ first, last, page, pageCount, prevPageCallback, nextPageCallback, totalRecords }">
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex gap-2">
              <Button
                @click="prevPageCallback"
                :disabled="page === 0"
                variant="outlined"
                severity="secondary"
                icon="fi-rr-angle-small-left text-lg!"
                class="size-9! shadow-xs"
              />
              <Button
                @click="nextPageCallback"
                :disabled="page === (pageCount || 0) - 1 || (totalRecords || 0) === 0"
                variant="outlined"
                severity="secondary"
                icon="fi-rr-angle-small-right text-lg!"
                class="size-9! shadow-xs"
              />
            </div>
            <span class="text-sm! text-zinc-600 dark:text-zinc-400"> {{ (totalRecords || 0) > 0 ? first || 0 : 0 }} - {{ last || 0 }} de {{ totalRecords || 0 }} </span>
          </div>
          <div class="flex items-center gap-2">
            <Select
              v-model="rows"
              :options="[5, 10, 15, 20]"
              size="small"
              class="h-9!"
            />
          </div>
        </div>
      </template>

      <template #empty>
        <div class="gap-2 bg-white p-2 dark:bg-zinc-900">
          <div
            class="flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-center font-medium text-zinc-400 shadow-xs ring-2 ring-white ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:text-zinc-500 dark:ring-zinc-900/65"
          >
            <i class="fi-rr-calendar-xmark text-xl"></i>
            <span>No se encontraron jornadas en el historial</span>
          </div>
        </div>
      </template>

      <template #grid="slotProps">
        <div class="grid grid-cols-1 gap-2 bg-white p-2 dark:bg-zinc-900">
          <div
            v-for="item in slotProps.items"
            :key="item.id"
            @click="emit('view-details', item)"
            class="group flex cursor-pointer flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 shadow-xs ring-2 ring-white transition-all ring-inset hover:border-emerald-400 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
          >
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center gap-3">
                <div class="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-lg text-emerald-500 ring ring-current/20 ring-inset dark:bg-emerald-500/10 dark:text-emerald-400">
                  <i class="fi-rr-calendar-lines"></i>
                </div>
                <span class="text-base! font-extrabold text-zinc-700 dark:text-zinc-200"> Jornada #{{ item.id }} </span>
              </div>
              <div class="flex flex-col gap-0.5">
                <div class="flex items-center gap-1.5">
                  <span class="text-sm text-zinc-500 dark:text-zinc-400"> <strong class="font-semibold text-zinc-600 dark:text-zinc-300">Apertura:</strong> {{ formatTinyDate(item.apertura) }} </span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-sm text-zinc-500 dark:text-zinc-400">
                    <strong class="font-semibold text-zinc-600 dark:text-zinc-300">Cierre:</strong> {{ item.cierre ? formatTinyDate(item.cierre) : 'En curso...' }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between border-t border-zinc-200/60 pt-3 sm:justify-end sm:gap-6 sm:border-0 sm:pt-0 dark:border-zinc-700/60">
              <div class="flex flex-col items-start gap-1 sm:items-end">
                <span class="text-base! font-semibold! text-zinc-700 dark:text-zinc-200">
                  {{ formatCurrency(item.total_ventas) }}
                </span>
                <Tag
                  :value="item.estatus === 'ABIERTA' ? 'Abierta' : 'Cerrada'"
                  :severity="item.estatus === 'ABIERTA' ? 'success' : 'secondary'"
                  class="h-5! ring ring-current/10 ring-inset *:text-xs!"
                />
              </div>
              <i class="fi-rr-angle-small-right ml-2 text-xl text-zinc-400 transition-transform group-hover:translate-x-1 dark:text-zinc-500"></i>
            </div>
          </div>
        </div>
      </template>
    </DataView>

    <Menu
      ref="menu"
      :model="menuOptions"
      :popup="true"
    />
  </div>
</template>
