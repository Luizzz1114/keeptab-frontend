<script setup lang="ts">
import { ref } from 'vue';

interface Producto {
  id: number;
  nombre: string;
  contable: boolean;
  stock: number | null;
  precio: number;
}

type LayoutType = 'list' | 'grid';

const layout = ref<LayoutType>('grid');
const options = ref<LayoutType[]>(['list', 'grid']);
const rows = ref<number>(5);

const data = ref<Producto[]>([
  {
    id: 1,
    nombre: 'Laptop Pro 15"',
    contable: true,
    stock: 24,
    precio: 1299.99,
  },
  {
    id: 2,
    nombre: 'Suscripción de Software',
    contable: false,
    stock: null,
    precio: 15.0,
  },
  {
    id: 3,
    nombre: 'Teclado Mecánico RGB',
    contable: true,
    stock: 0,
    precio: 85.5,
  },
  {
    id: 4,
    nombre: 'Monitor 4K',
    contable: true,
    stock: 12,
    precio: 350.0,
  },
]);
</script>

<template>
  <div class="rounded-xl border border-zinc-300 dark:border-zinc-700 shadow-xs">
    <DataView
      :value="data"
      :layout="layout"
      :rows="rows"
      paginator
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Buscador -->
          <IconField>
            <InputIcon>
              <i class="fi-rr-search"></i>
            </InputIcon>
            <InputText
              id="buscador"
              placeholder="Buscador"
              size="small"
              class="h-9! max-w-50"
              autocomplete="off"
            />
          </IconField>
          <!-- Layout -->
          <SelectButton
            v-model="layout"
            :options="options"
            :allowEmpty="false"
            size="small"
            class="table-grid"
          >
            <template #option="{ option }">
              <i :class="[option === 'list' ? 'fi-rr-list' : 'fi-rr-apps']" />
            </template>
          </SelectButton>
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
            <span class="text-sm! text-zinc-600 dark:text-zinc-400"> {{ (totalRecords || 0) > 0 ? (first || 0) + 1 : 0 }} - {{ last || 0 }} de {{ totalRecords || 0 }} </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm! text-zinc-600 dark:text-zinc-400">Mostrando:</span>
            <Select
              v-model="rows"
              :options="[5, 10, 20]"
              size="small"
              class="h-9!"
            />
          </div>
        </div>
      </template>

      <template #list="slotProps">
        <div class="flex flex-col gap-4">
          <div
            v-for="item in slotProps.items"
            :key="item.id"
          >
            {{ item.nombre }}
          </div>
        </div>
      </template>

      <template #grid="slotProps">
        <div class="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div
            v-for="item in slotProps.items"
            :key="item.id"
            class="dar flex flex-col gap-1 rounded-xl border border-zinc-300 bg-zinc-50 p-3 shadow-xs ring-2 ring-white ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
          >
            <div class="flex items-start justify-between">
              <div class="grid size-9 place-items-center rounded-lg bg-emerald-100 text-lg text-emerald-500 ring ring-current/20 ring-inset dark:bg-emerald-500/10 dark:text-emerald-400">
                <i class="fi-br-cube"></i>
              </div>
            </div>
            <span class="text-base! font-extrabold">{{ item.nombre }}</span>
            <Divider class="my-1!" />
            <div class="flex items-center justify-between">
              <span class="text-lg! font-extrabold">{{ item.precio }} <span class="font-bold">Bs</span></span>
              <Tag
                :value="item.stock || '\u221E'"
                severity="secondary"
                class="*:text-xs!"
              />
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>
