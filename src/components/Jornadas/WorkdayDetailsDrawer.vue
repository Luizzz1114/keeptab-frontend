<script setup lang="ts">
import { computed } from 'vue';
import { formatCurrency, formatTinyDate, getTimeAgo } from '@/utils/formatters';
import type { Jornada } from '@/types/jornadas.types';

const visible = defineModel<boolean>('visible');

const props = defineProps<{
  jornada: Jornada | null;
}>();

// --- Lógica de Agrupación de Productos ---
const resumenProductos = computed(() => {
  if (!props.jornada?.ventas) return [];

  const resumen = new Map<string, { nombre: string; cantidad: number }>();

  props.jornada.ventas.forEach((venta: any) => {
    // Verificamos que la venta tenga detalles
    if (venta.detalles_venta && venta.detalles_venta.length > 0) {
      venta.detalles_venta.forEach((detalle: any) => {
        const nombre = detalle.producto?.nombre || 'Producto desconocido';
        const cantidad = Number(detalle.cantidad) || 0;

        if (resumen.has(nombre)) {
          resumen.get(nombre)!.cantidad += cantidad;
        } else {
          resumen.set(nombre, { nombre, cantidad });
        }
      });
    }
  });

  // Convertimos el Map a un array y lo ordenamos de mayor a menor cantidad
  return Array.from(resumen.values()).sort((a, b) => b.cantidad - a.cantidad);
});

const totalArticulosVendidos = computed(() => {
  return resumenProductos.value.reduce((acc, curr) => acc + curr.cantidad, 0);
});
</script>

<template>
  <Drawer
    v-model:visible="visible"
    position="right"
    :dismissable="false"
    class="m-2! h-[calc(100dvh-1rem)]! w-[calc(100%-1rem)]! overflow-hidden rounded-2xl! border! md:w-180!"
  >
    <template #container="{ closeCallback }">
      <div class="flex h-16 items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-700">
        <div class="flex items-center gap-3">
          <div class="grid size-9 place-items-center rounded-lg bg-emerald-500 text-lg text-white">
            <i class="fi-sr-calendar"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-lg! font-bold dark:text-zinc-200">
              Detalles de la jornada
              <span
                v-if="jornada?.id"
                class="ml-1 text-zinc-500"
                >#{{ jornada.id }}</span
              >
            </span>
          </div>
        </div>
        <Button
          @click="closeCallback"
          icon="fi-br-cross"
          severity="secondary"
          class="size-8! *:text-xs!"
        />
      </div>

      <div
        v-if="jornada"
        class="flex h-full flex-col overflow-hidden"
      >
        <div class="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
          <div
            class="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-xs ring-2 ring-white ring-inset sm:grid-cols-3 dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
          >
            <div class="flex items-center gap-2 sm:col-span-3">
              <i class="fi-br-info text-base text-emerald-500"></i>
              <span class="text-sm! font-extrabold uppercase">Información general</span>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500">Estatus</span>
              <div>
                <Tag
                  :value="jornada.estatus === 'ABIERTA' ? 'Abierta' : 'Cerrada'"
                  :severity="jornada.estatus === 'ABIERTA' ? 'success' : 'secondary'"
                  class="h-5! ring ring-current/10 ring-inset *:text-xs!"
                />
              </div>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500">Apertura</span>
              <span class="font-medium text-zinc-700 dark:text-zinc-200">
                {{ formatTinyDate(jornada.apertura) }}
              </span>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500">Cierre</span>
              <span class="font-medium text-zinc-700 dark:text-zinc-200">
                {{ jornada.cierre ? formatTinyDate(jornada.cierre) : 'En curso...' }}
              </span>
            </div>
          </div>

          <div
            class="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-xs ring-2 ring-white ring-inset sm:grid-cols-2 lg:grid-cols-4 dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
          >
            <div class="flex items-center gap-2 sm:col-span-2 lg:col-span-4">
              <i class="fi-br-money text-base text-emerald-500"></i>
              <span class="text-sm! font-extrabold uppercase">Resumen financiero</span>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500">Fondo Inicial</span>
              <span class="font-medium text-zinc-700 dark:text-zinc-200">{{ formatCurrency(jornada.fondo_inicial || 0) }}</span>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500">Total Ventas</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ formatCurrency(jornada.total_ventas || 0) }}</span>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500">Total Físico</span>
              <span class="font-medium text-zinc-700 dark:text-zinc-200">{{ formatCurrency(jornada.total_fisico || 0) }}</span>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500">Diferencia</span>
              <span class="font-medium text-zinc-700 dark:text-zinc-200">{{ formatCurrency(jornada.diferencia || 0) }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 pb-5 shadow-xs ring-2 ring-white ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="fi-br-box text-base text-emerald-500"></i>
                <span class="text-sm! font-extrabold uppercase">Productos vendidos</span>
              </div>
            </div>

            <div class="flex flex-col">
              <template v-if="resumenProductos.length > 0">
                <div
                  v-for="(item, index) in resumenProductos"
                  :key="index"
                  class="flex items-baseline justify-between border-b border-zinc-200 py-2.5 last:border-0 last:pb-0 dark:border-zinc-700/50"
                >
                  <span class="font-medium text-zinc-700 dark:text-zinc-200">{{ item.nombre }}</span>
                  <div class="flex items-baseline gap-2">
                    <span class="font-bold text-zinc-600 dark:text-zinc-300">{{ item.cantidad }}</span>
                    <span class="text-xs text-zinc-400 dark:text-zinc-500">unid.</span>
                  </div>
                </div>

                <div class="flex items-baseline justify-between pt-4">
                  <span class="font-bold text-zinc-700 uppercase dark:text-zinc-200">Total</span>
                  <div class="flex items-baseline gap-2">
                    <span class="font-bold text-zinc-600 dark:text-zinc-300">{{ totalArticulosVendidos }}</span>
                    <span class="text-xs text-zinc-400 dark:text-zinc-500">unid.</span>
                  </div>
                </div>
              </template>

              <div
                v-else
                class="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400"
              >
                No hay productos detallados en esta jornada.
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 pb-5 shadow-xs ring-2 ring-white ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="fi-br-receipt text-base text-emerald-500"></i>
                <span class="text-sm! font-extrabold uppercase">Ventas registradas</span>
              </div>
            </div>

            <div class="flex flex-col">
              <template v-if="jornada.ventas && jornada.ventas.length > 0">
                <div
                  v-for="item in jornada.ventas"
                  :key="item.id"
                  class="flex items-center justify-between border-b border-zinc-200 py-3 last:border-0 last:pb-0 dark:border-zinc-700/50"
                >
                  <div class="flex items-center gap-3">
                    <div class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-200/50 text-zinc-500 dark:bg-zinc-400/10 dark:text-zinc-300">
                      <i :class="item.estatus === 'CONTADO' ? 'fi-rr-arrow-trend-up' : 'fi-rr-memo-pad'"></i>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-zinc-700 dark:text-zinc-200"> {{ item.estatus === 'CONTADO' ? 'Venta' : 'A crédito' }} #{{ item.id }} </span>
                      <span class="text-[11px]! text-zinc-500 dark:text-zinc-400">
                        {{ getTimeAgo(item.created_at) }}
                      </span>
                    </div>
                  </div>
                  <div class="font-bold text-zinc-700 dark:text-zinc-100">{{ formatCurrency(item.total) }}</div>
                </div>
              </template>

              <div
                v-else
                class="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400"
              >
                No hay ventas registradas en esta jornada.
              </div>
            </div>
          </div>
        </div>

        <div class="flex h-16 shrink-0 items-center justify-end gap-3 border-t border-zinc-200 p-4 dark:border-zinc-700">
          <Button
            @click="closeCallback"
            label="Cerrar"
            type="button"
            size="small"
            severity="secondary"
          />
        </div>
      </div>
    </template>
  </Drawer>
</template>
