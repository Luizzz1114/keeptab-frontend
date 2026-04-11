<script setup lang="ts">
import { ref } from 'vue';
import type { Producto } from '@/types/productos.type';
import TableGrid from '@/components/Productos/TableGrid.vue';
import Breadcrumb from '@/components/ui/CustomBreadcrumb.vue';
import DialogDelete from '@/components/ui/DialogDelete.vue';
import DrawerRegister from '@/components/Productos/DrawerRegister.vue';

// --- Configuración de la vista ---
const items = [{ label: 'Productos', route: '/productos' }];

// --- Funciones de los Modales ---
const isDrawerRegisterOpen = ref<boolean>(false);
const confirmDialogRef = ref<any>(null);



const handleDeleteRequest = (item: Producto) => {
  const info = {
    'Nombre del producto': item.nombre,
    Categoría: item.categoria,
    Precio: `${item.precio} Bs`,
    Stock: item.stock != null ? `${item.stock} unidades` : '\u221E Infinito',
  };
  confirmDialogRef.value.openConfirm(item, info);
};
</script>

<template>
  <div class="flex flex-col">
    <Breadcrumb :items="items" />
    <div class="mt-4 mb-4 flex justify-between">
      <div class="flex items-center gap-3">
        <div class="grid size-9 place-items-center rounded-lg bg-emerald-500 text-white text-lg">
          <i class="fi-sr-box"></i>
        </div>
        <h2 class="text-lg font-extrabold dark:text-zinc-200">Productos</h2>
      </div>
      <Button
        @click="isDrawerRegisterOpen = true"
        label="Nuevo producto"
        icon="fi-br-plus-small"
        size="small"
        class="flex! h-9! items-center! shadow-xs!"
      />
    </div>
    <TableGrid @delete="handleDeleteRequest" />
    <DrawerRegister v-model:visible="isDrawerRegisterOpen" />
    <DialogDelete ref="confirmDialogRef" />
  </div>
</template>
