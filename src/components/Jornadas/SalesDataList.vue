<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Venta } from '@/types/ventas.types';
import { formatCurrency, getTimeAgo } from '@/utils/formatters';

// --- Props y Emits ---
const props = defineProps<{ ventas?: Venta[] }>();
const emit = defineEmits(['view', 'delete']);

// --- Estado (Refs) ---
const rows = ref<number>(5); // Número de filas por defecto
const menu = ref<any>(null);
const selectedItem = ref<Venta | null>(null);

// --- Lógica del Menú de Opciones ---
const menuOptions = computed(() => [
  {
    label: 'Ver detalles',
    icon: 'fi-rr-eye',
    command: () => {
      if (selectedItem.value) emit('view', selectedItem.value);
    },
  },
  { separator: true },
  {
    label: 'Eliminar',
    icon: 'fi-rr-trash',
    class: 'menu-item-danger',
    command: () => {
      if (selectedItem.value) emit('delete', selectedItem.value);
    },
  },
]);

const toggleMenu = (event: Event, item: Venta) => {
  selectedItem.value = item;
  menu.value?.toggle(event);
};
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <div class="grid size-9 place-items-center rounded-xl bg-emerald-100 font-bold text-emerald-500 ring ring-current/20 ring-inset dark:bg-emerald-500/10 dark:text-emerald-400">
        <i class="fi-br-pending"></i>
      </div>
      <span class="font-bold">Actividad reciente</span>
    </div>

    <div class="mt-4 flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-xs ring-2 ring-white ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65">
      <DataView
        :value="ventas"
        :rows="rows"
        paginator
      >
        <template #list="slotProps">
          <div class="flex flex-col p-3">
            <div
              v-for="item in slotProps.items"
              :key="item.id"
              class="mb-3 flex items-center justify-between border-b border-zinc-200 pb-3 last:mb-0 last:border-0 last:pb-0 dark:border-zinc-700"
            >
              <div class="flex items-center gap-3">
                <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-200/50 text-zinc-500 dark:bg-zinc-400/10 dark:text-zinc-300">
                  <i :class="item.estatus === 'PAGADA' ? 'fi-sr-arrow-trend-up' : 'fi-rr-memo-pad'"></i>
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-zinc-700 dark:text-zinc-200"> {{ item.estatus === 'PAGADA' ? 'Venta' : 'A crédito' }} #{{ item.id }} </span>
                  <span class="text-[11px]! text-zinc-500 dark:text-zinc-400">
                    {{ getTimeAgo(item.created_at) }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-base font-semibold text-zinc-700 dark:text-zinc-200">{{ formatCurrency(item.total) }}</span>
                <Button
                  @click="toggleMenu($event, item)"
                  type="button"
                  icon="fi-rr-menu-dots text-[0.95rem]"
                  severity="secondary"
                  class="size-7!"
                />
              </div>
            </div>
          </div>
        </template>

        <template #paginatorcontainer="{ first, last, page, pageCount, prevPageCallback, nextPageCallback, totalRecords }">
          <div class="flex w-full items-center justify-between border-zinc-200 p-1 dark:border-zinc-700">
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
          <div class="flex flex-col items-center justify-center gap-1.5 p-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
            <i class="fi-rr-receipt text-2xl"></i>
            No hay ventas registradas en esta jornada
          </div>
        </template>
      </DataView>
    </div>

    <Menu
      ref="menu"
      :model="menuOptions"
      :popup="true"
    />
  </div>
</template>