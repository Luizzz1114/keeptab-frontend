<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Producto } from '@/types/productos.types';
import { formatearMonto } from '@/utils/formatters';
import { iconosPorCategoria } from '@/schemas/productos.schema';

// --- 1. Props y Emits ---
const props = defineProps<{ data?: Producto[] }>();
const emit = defineEmits<{ (e: 'add-to-cart', producto: Producto): void }>();

// --- 2. Estado (Refs) ---
const searchQuery = ref<string>('');

// --- 3. Propiedades Computadas ---
const filteredData = computed(() => {
  if (!searchQuery.value || !props.data) return props.data;
  const query = searchQuery.value.toLowerCase();
  const camposDeBusqueda: (keyof Producto)[] = ['nombre', 'categoria', 'precio'];
  return props.data.filter((item) => camposDeBusqueda.some((campo) => String(item[campo]).toLowerCase().includes(query)));
});

const agregarAlCarrito = (producto: Producto) => {
  if (!producto.conteo || (producto.stock !== null && producto.stock > 0)) {
    emit('add-to-cart', producto);
  }
};
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 shadow-xs dark:border-zinc-700 dark:bg-zinc-950/50">
    <DataView :value="filteredData" layout="grid">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <IconField>
            <InputIcon>
              <i class="fi-rr-search"></i>
            </InputIcon>
            <InputText id="buscador" v-model="searchQuery" placeholder="Buscador" size="small" class="h-9! max-w-50" autocomplete="off" />
          </IconField>
        </div>
      </template>

      <template #empty>
        <div class="gap-2 bg-white p-2 dark:bg-zinc-900">
          <div
            class="flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-center font-medium text-zinc-400 shadow-xs ring-2 ring-white ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:text-zinc-500 dark:ring-zinc-900/65"
          >
            <span>No se encontraron registros</span>
          </div>
        </div>
      </template>

      <template #grid="slotProps">
        <div class="grid grid-cols-1 gap-2 bg-white p-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 dark:bg-zinc-900">
          <Button
            v-for="item in slotProps.items"
            :key="item.id"
            @click="agregarAlCarrito(item)"
            :disabled="item.conteo === true && item.stock === 0"
            unstyled
            class="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-start! shadow-xs ring-2 ring-white duration-200 ease-in-out ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
            :class="[item.conteo === true && item.stock === 0 ? 'opacity-60 grayscale' : 'cursor-pointer hover:scale-101! hover:border-emerald-500 active:scale-99! active:border-emerald-200!']"
          >
            <div class="flex items-start justify-between">
              <div class="grid size-10 place-items-center rounded-xl bg-emerald-100 text-lg text-emerald-500 ring ring-current/20 ring-inset dark:bg-emerald-500/10 dark:text-emerald-400">
                <i :class="iconosPorCategoria[item?.categoria] || iconosPorCategoria['Otros']"></i>
              </div>
            </div>
            <div class="flex flex-col">
              <span class="truncate text-base! font-semibold whitespace-nowrap">
                {{ item?.nombre }}
              </span>
              <span class="text-xs! font-medium text-zinc-400 dark:text-zinc-500">
                {{ item?.categoria }}
              </span>
            </div>
            <Divider class="my-1!" />
            <div class="flex items-center justify-between whitespace-nowrap">
              <div class="flex flex-col">
                <span class="text-xs! font-bold text-zinc-500 dark:text-zinc-400">Precio</span>
                <span class="text-lg! font-extrabold">
                  {{ item?.precio !== undefined ? formatearMonto(item.precio) : '0,00' }}
                  <span class="font-semibold text-zinc-400 dark:text-zinc-500">Bs</span>
                </span>
              </div>
              <div class="flex h-full flex-col items-end gap-1">
                <span class="text-xs! font-bold text-zinc-500 dark:text-zinc-400">Stock</span>
                <Tag
                  :value="item.conteo === true ? `${item.stock} u.` : '\u221E'"
                  :severity="item.conteo === true && item.stock <= 5 ? 'danger' : 'secondary'"
                  class="h-5! ring ring-current/10 ring-inset *:text-xs!"
                />
              </div>
            </div>
          </Button>
        </div>
      </template>
    </DataView>
  </div>
</template>
