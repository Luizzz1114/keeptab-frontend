<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Producto } from '@/types/productos.type';
import type { LayoutType } from '@/types/ui.types';

// --- 1. Props y Emits ---
const props = withDefaults(defineProps<{ productos?: Producto[] }>(), {
  productos: () => [
    { id: 1, nombre: 'Laptop Pro 15"', categoria: 'Tecnología', contable: true, stock: 24, precio: 1299.99 },
    { id: 2, nombre: 'Suscripción de Software', categoria: 'Tecnología', contable: false, stock: null, precio: 15.0 },
    { id: 3, nombre: 'Teclado Mecánico RGB', categoria: 'Tecnología', contable: true, stock: 0, precio: 85.5 },
    { id: 4, nombre: 'Monitor 4K', categoria: 'Tecnología', contable: true, stock: 12, precio: 350.0 },
  ],
});

const emit = defineEmits(['edit', 'delete']);

// --- 2. Estado (Refs) ---
const layout = ref<LayoutType>('grid');
const options = ref<LayoutType[]>(['list', 'grid']);
const rows = ref<number>(8);
const searchQuery = ref<string>('');

const menu = ref<any>(null);
const selectedItem = ref<Producto | null>(null);

// --- 3. Propiedades Computadas ---
const filteredData = computed(() => {
  if (!searchQuery.value) return props.productos;
  const query = searchQuery.value.toLowerCase();
  return props.productos.filter((item) => item.nombre.toLowerCase().includes(query));
});

const menuOptions = computed(() => [
  {
    label: 'Actualizar',
    icon: 'fi-rr-pencil',
    command: () => emit('edit', selectedItem.value),
  },
  { separator: true },
  {
    label: 'Eliminar',
    icon: 'fi-rr-trash',
    class: 'menu-item-danger',
    command: () => emit('delete', selectedItem.value),
  },
]);

// --- 4. Métodos ---
const toggleMenu = (event: Event, item: Producto) => {
  selectedItem.value = item;
  menu.value?.toggle(event);
};
</script>

<template>
  <div class="rounded-xl border border-zinc-200 bg-zinc-50 shadow-xs dark:border-zinc-700 dark:bg-zinc-950/50">
    <DataView
      :value="filteredData"
      :layout="layout"
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
              placeholder="Buscador"
              size="small"
              class="h-9! max-w-50"
              autocomplete="off"
            />
          </IconField>
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
            <span class="text-sm! text-zinc-600 dark:text-zinc-400"> {{ (totalRecords || 0) > 0 ? first || 0 : 0 }} - {{ last || 0 }} de {{ totalRecords || 0 }} </span>
          </div>
          <div class="flex items-center gap-2">
            <Select
              v-model="rows"
              :options="[4, 8, 12, 16, 20]"
              size="small"
              class="h-9!"
            />
          </div>
        </div>
      </template>

      <template #list="slotProps">
        <div class="bg-white dark:bg-zinc-900">
          <DataTable
            :value="slotProps.items"
            class="w-full *:whitespace-nowrap"
            size="medium"
          >
            <Column
              field="nombre"
              header="Producto"
            >
              <template #body="{ data }">
                <div class="flex items-center gap-3">
                  <div class="grid size-8 place-items-center rounded-lg bg-emerald-100 text-base text-emerald-500 ring ring-current/20 ring-inset dark:bg-emerald-500/10 dark:text-emerald-400">
                    <i class="fi-rr-cube"></i>
                  </div>
                  <span>{{ data.nombre }}</span>
                </div>
              </template>
            </Column>
            <Column
              field="categoria"
              header="Categoría"
            ></Column>
            <Column
              field="precio"
              header="Precio"
            >
              <template #body="{ data }">
                <span>{{ Number(data.precio).toFixed(2) }} Bs</span>
              </template>
            </Column>
            <Column
              field="stock"
              header="Stock"
            >
              <template #body="{ data }">
                <Tag
                  :value="data.stock != null ? `${data.stock} unidades` : '\u221E Infinito'"
                  :severity="data.stock != null && data.stock <= 5 ? 'danger' : 'secondary'"
                  class="h-5! ring ring-current/10 ring-inset *:text-xs!"
                />
              </template>
            </Column>
            <Column header="Acciones">
              <template #body="props">
                <Button
                  @click="toggleMenu($event, props.data)"
                  type="button"
                  icon="fi-rr-menu-dots text-[0.95rem]"
                  severity="secondary"
                  class="size-7!"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </template>

      <template #grid="slotProps">
        <div class="grid grid-cols-1 gap-2 bg-white p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 dark:bg-zinc-900">
          <div
            v-for="item in slotProps.items"
            :key="item.id"
            class="dar flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 shadow-xs ring-2 ring-white ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
          >
            <div class="flex items-start justify-between">
              <div class="grid size-10 place-items-center rounded-xl bg-emerald-100 text-lg text-emerald-500 ring ring-current/20 ring-inset dark:bg-emerald-500/10 dark:text-emerald-400">
                <i class="fi-rr-cube"></i>
              </div>
              <Button
                @click="toggleMenu($event, item)"
                type="button"
                icon="fi-rr-menu-dots text-[0.95rem]"
                severity="secondary"
                class="size-7!"
              />
            </div>
            <div class="flex flex-col">
              <span class="truncate text-base! font-semibold whitespace-nowrap">{{ item.nombre }}</span>
              <span class="text-xs! font-medium text-zinc-400 dark:text-zinc-500">{{ item.categoria }}</span>
            </div>
            <Divider class="my-1!" />
            <div class="flex items-center justify-between">
              <div class="flex flex-col">
                <span class="text-xs! font-bold text-zinc-500 dark:text-zinc-400">Precio</span>
                <span class="text-lg! font-extrabold">{{ Number(item.precio).toFixed(2) }} <span class="font-semibold text-zinc-400 dark:text-zinc-500">Bs</span></span>
              </div>
              <div class="flex h-full flex-col items-end gap-1">
                <span class="text-xs! font-bold text-zinc-500 dark:text-zinc-400">Stock</span>
                <Tag
                  :value="item.stock != null ? `${item.stock} unidades` : '\u221E Infinito'"
                  :severity="item.stock != null && item.stock <= 5 ? 'danger' : 'secondary'"
                  class="h-5! ring ring-current/10 ring-inset *:text-xs!"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
  <Menu
    ref="menu"
    :model="menuOptions"
    :popup="true"
  />
</template>
