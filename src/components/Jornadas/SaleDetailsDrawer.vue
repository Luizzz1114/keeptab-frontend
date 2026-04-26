<script setup lang="ts">
import type { Venta } from '@/types/ventas.types';
import { formatCurrency, formatTinyDate } from '@/utils/formatters';

const visible = defineModel<boolean>('visible');
const props = defineProps<{ venta: Venta | null }>();
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
            <i class="fi-sr-receipt"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-lg! font-bold dark:text-zinc-200">
              Detalles de la venta
              <span
                v-if="venta?.id"
                class="ml-1 text-zinc-500"
                >#{{ venta.id }}</span
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
        v-if="venta"
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
                  :value="venta.estatus === 'PAGADA' ? 'Pagada' : 'A débito'"
                  :severity="venta.estatus === 'PAGADA' ? 'Success' : 'warn'"
                  class="h-5! ring ring-current/10 ring-inset *:text-xs!"
                />
              </div>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500">Fecha</span>
              <span class="font-medium text-zinc-700 dark:text-zinc-200">
                {{ formatTinyDate(venta.fecha) }}
              </span>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500">Total Venta</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400"> {{ formatCurrency(venta.total) }}</span>
            </div>
          </div>

          <div
            v-if="venta.cliente"
            class="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-xs ring-2 ring-white ring-inset sm:grid-cols-3 dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
          >
            <div class="flex items-center gap-2 sm:col-span-3">
              <i class="fi-br-user text-base text-emerald-500"></i>
              <span class="text-sm! font-extrabold uppercase">Datos del cliente</span>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500">Nombre</span>
              <span class="font-medium text-zinc-700 dark:text-zinc-200">{{ venta.cliente.nombre }}</span>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500">Cédula</span>
              <span class="font-medium text-zinc-700 dark:text-zinc-200">{{ venta.cliente.cedula || 'N/A' }}</span>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500">Contacto</span>
              <span class="font-medium text-zinc-700 dark:text-zinc-200">{{ venta.cliente.contacto || 'N/A' }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 pb-5 shadow-xs ring-2 ring-white ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="fi-br-box text-base text-emerald-500"></i>
                <span class="text-sm! font-extrabold uppercase">Productos</span>
              </div>
            </div>

            <div class="flex flex-col">
              <div
                v-for="detalle in venta.detalles"
                :key="detalle.id"
                class="flex items-center justify-between border-b border-zinc-200 py-3 first:pt-0 last:border-0 last:pb-0 dark:border-zinc-700"
              >
                <div class="flex flex-col">
                  <span class="font-bold text-zinc-900 dark:text-zinc-200">
                    {{ detalle.producto?.nombre }}
                  </span>
                  <span class="text-xs! text-zinc-500 dark:text-zinc-400">{{ detalle.cantidad }} unid. x {{ formatCurrency(detalle.precio_unitario || 0) }}</span>
                </div>
                <div class="font-bold text-zinc-700 dark:text-zinc-100">{{ formatCurrency(detalle.subtotal || 0) }}</div>
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
