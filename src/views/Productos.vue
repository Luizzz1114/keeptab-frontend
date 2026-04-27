<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Producto } from '@/types/productos.types';
import Breadcrumb from '@/components/ui/CustomBreadcrumb.vue';
import ProductsDataView from '@/components/Productos/ProductsDataView.vue';
import ProductCreateDrawer from '@/components/Productos/ProductCreateDrawer.vue';
import ProductEditDrawer from '@/components/Productos/ProductEditDrawer.vue';
import DialogDelete from '@/components/ui/DialogDelete.vue';
import productosService from '@/api/services/productos.service';
import { useNotifications } from '@/composables/useNotifications';
import { formatCurrency } from '@/utils/formatters';

// --- Configuración de la vista ---
const { showSuccess, showError } = useNotifications();

const items = [{ label: 'Productos', route: '/productos' }];

// --- Funciones de los Modales ---
const isDrawerRegisterOpen = ref<boolean>(false);
const isDrawerEditOpen = ref<boolean>(false);
const confirmDialogRef = ref<any>(null);

const handleEditRequest = async (item: Producto) => {
  selectedProduct.value = item;
  if (selectedProduct.value) {
    isDrawerEditOpen.value = true;
  }
};

const handleDeleteRequest = (item: Producto) => {
  const info = {
    'Nombre del producto': item.nombre,
    Categoría: item.categoria,
    Precio: formatCurrency(item.precio),
    Stock: item.conteo ? `${item.stock} unid.` : '\u221E Infinito',
  };
  confirmDialogRef.value.openConfirm(item, info);
};

// --- Operaciones con la API ---
const products = ref<Producto[]>([]);
const selectedProduct = ref<Producto | null>(null);

const create = async (product: Producto) => {
  try {
    const res = await productosService.create(product);
    showSuccess(res.message);
    await getAll();
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const getAll = async () => {
  try {
    const res = await productosService.getAll();
    products.value = res.data;
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const update = async (product: Producto) => {
  try {
    const res = await productosService.update(product);
    showSuccess(res.message);
    await getAll();
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const remove = async (id: Producto['id']) => {
  try {
    const res = await productosService.remove(id);
    showSuccess(res.message);
    await getAll();
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
    <div class="mt-4 mb-4 flex justify-between">
      <div class="flex items-center gap-3">
        <div class="grid size-9 place-items-center rounded-lg bg-emerald-500 text-lg text-white">
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
    <ProductsDataView
      :data="products"
      @edit="handleEditRequest"
      @delete="handleDeleteRequest"
    />
    <ProductCreateDrawer
      v-model:visible="isDrawerRegisterOpen"
      @confirm-create="create"
    />
    <ProductEditDrawer
      v-model:visible="isDrawerEditOpen"
      :producto="selectedProduct"
      @confirm-edit="update"
    />
    <DialogDelete
      ref="confirmDialogRef"
      label="producto"
      @confirm-delete="remove"
    />
  </div>
</template>
