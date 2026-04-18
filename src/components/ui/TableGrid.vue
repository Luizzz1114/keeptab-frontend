<script setup lang="ts">
import { ref, computed } from 'vue';
import type { LayoutType } from '@/types/ui.types';

export interface TableColumn {
  field: string;
  header: string;
  type?: 'text' | 'icon' | 'currency' | 'tag' | 'custom';
  iconMap?: Record<string, string>;
  format?: (value: any, row: any) => string;
  tagSeverity?: (value: any, row: any) => 'success' | 'secondary' | 'warn' | 'danger' | 'info';
  tagValue?: (value: any, row: any) => string;
}

export interface MenuOption {
  label: string;
  icon: string;
  command: () => void;
  separator?: boolean;
  class?: string;
}

export interface TableGridProps<T> {
  data?: T[];
  columns: TableColumn[];
  searchFields?: (keyof T)[];
  menuOptions?: MenuOption[];
  iconField?: string;
}

const props = withDefaults(defineProps<TableGridProps<any>>(), {
  data: () => [],
  searchFields: () => [],
  menuOptions: () => [],
});

// --- Estado (Refs) ---
const layout = ref<LayoutType>('grid');
const options = ref<LayoutType[]>(['list', 'grid']);
const rows = ref<number>(8);
const searchQuery = ref<string>('');

const menu = ref<any>(null);
const selectedItem = ref<any>(null);

// --- Propiedades Computadas ---
const filteredData = computed(() => {
  if (!searchQuery.value || !props.data?.length) return props.data;
  if (!props.searchFields.length) return props.data;
  
  const query = searchQuery.value.toLowerCase();
  return props.data.filter((item) => 
    props.searchFields.some((campo) => 
      String(item[campo as string]).toLowerCase().includes(query)
    )
  );
});

// --- Métodos ---
const toggleMenu = (event: Event, item: any) => {
  selectedItem.value = item;
  menu.value?.toggle(event);
};

const getColumnValue = (row: any, column: TableColumn): any => {
  return row[column.field];
};

const formatValue = (row: any, column: TableColumn): string => {
  const value = getColumnValue(row, column);
  
  if (column.format) {
    return column.format(value, row);
  }
  
  if (column.type === 'currency') {
    return `${value} Bs`;
  }
  
  return value ?? '-';
};

const getTagValue = (row: any, column: TableColumn): string => {
  const value = getColumnValue(row, column);
  if (column.tagValue) {
    return column.tagValue(value, row);
  }
  return String(value ?? '-');
};

const getTagSeverity = (row: any, column: TableColumn): 'success' | 'secondary' | 'warn' | 'danger' | 'info' => {
  const value = getColumnValue(row, column);
  if (column.tagSeverity) {
    return column.tagSeverity(value, row);
  }
  return 'secondary';
};

const getIconForRow = (row: any): string => {
  if (props.iconField && row[props.iconField]) {
    return row[props.iconField];
  }
  return 'fi-rr-box';
};

const getFirstChar = (row: any): string => {
  const firstField = props.columns[0]?.field;
  if (firstField && row[firstField]) {
    return String(row[firstField]).charAt(0).toUpperCase();
  }
  return '?';
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
          <IconField v-if="searchFields.length > 0">
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

      <template #empty>
        <div class="gap-2 bg-white p-2 dark:bg-zinc-900">
          <div
            class="flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-center font-medium text-zinc-400 shadow-xs ring-2 ring-white ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:text-zinc-500 dark:ring-zinc-900/65"
          >
            <span>No se encontraron registros</span>
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
              v-for="col in columns"
              :key="col.field"
              :field="col.field"
              :header="col.header"
            >
              <template #body="{ data }">
                <!-- Tipo Icono -->
                <div v-if="col.type === 'icon'" class="flex items-center gap-3">
                  <div class="grid size-8 place-items-center rounded-lg bg-emerald-100 text-base font-extrabold text-emerald-500 dark:text-emerald-400 ring ring-current/20 ring-inset dark:bg-emerald-500/10">
                    <i :class="getIconForRow(data)"></i>
                  </div>
                  <span>{{ formatValue(data, col) }}</span>
                </div>
                
                <!-- Tipo Tag -->
                <Tag
                  v-else-if="col.type === 'tag'"
                  :value="getTagValue(data, col)"
                  :severity="getTagSeverity(data, col)"
                  class="h-5! ring ring-current/10 ring-inset *:text-xs!"
                />
                
                <!-- Tipo Currency / Custom -->
                <span v-else-if="col.type === 'currency'">{{ formatValue(data, col) }}</span>
                
                <!-- Tipo texto por defecto -->
                <span v-else>{{ formatValue(data, col) }}</span>
              </template>
            </Column>
            
            <Column header="Acciones" v-if="menuOptions.length > 0">
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
        <div class="grid grid-cols-1 gap-2 bg-white p-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 dark:bg-zinc-900">
          <div
            v-for="item in slotProps.items"
            :key="item.id"
            class="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 shadow-xs ring-2 ring-white ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
          >
            <div class="flex items-start justify-between">
              <div class="grid size-10 place-items-center rounded-xl bg-emerald-100 font-bold text-emerald-500 ring ring-current/20 ring-inset dark:bg-emerald-500/10 dark:text-emerald-400">
                <span class="text-lg!">{{ getFirstChar(item) }}</span>
              </div>
              <Button
                v-if="menuOptions.length > 0"
                @click="toggleMenu($event, item)"
                type="button"
                icon="fi-rr-menu-dots text-[0.95rem]"
                severity="secondary"
                class="size-7!"
              />
            </div>
            <div class="flex flex-col">
              <span class="truncate text-base! font-semibold whitespace-nowrap">
                {{ item[columns[0]?.field] }}
              </span>
              <span class="text-xs! font-medium text-zinc-400 dark:text-zinc-500" v-if="columns[1]">
                {{ formatValue(item, columns[1]) }}
              </span>
            </div>
            
            <Divider class="my-1!" v-if="columns.length > 2" />
            
            <!-- Mostrar columnas adicionales en grid -->
            <div class="flex items-center justify-between" v-if="columns.length > 2">
              <div class="flex flex-col" v-for="col in columns.slice(2, 4)" :key="col.field">
                <span class="text-xs! font-bold text-zinc-500 dark:text-zinc-400">{{ col.header }}</span>
                
                <template v-if="col.type === 'tag'">
                  <Tag
                    :value="getTagValue(item, col)"
                    :severity="getTagSeverity(item, col)"
                    class="h-5! ring ring-current/10 ring-inset *:text-xs!"
                  />
                </template>
                <template v-else-if="col.type === 'currency'">
                  <span class="text-lg! font-extrabold">{{ formatValue(item, col) }}</span>
                </template>
                <template v-else>
                  <span class="text-sm! font-medium">{{ formatValue(item, col) }}</span>
                </template>
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
    v-if="menuOptions.length > 0"
  />
</template>