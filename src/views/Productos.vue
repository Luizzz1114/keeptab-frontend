<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Producto } from '@/types/productos.types';
import TableGrid from '@/components/Productos/TableGrid.vue';
import Breadcrumb from '@/components/ui/CustomBreadcrumb.vue';
import DrawerRegister from '@/components/Productos/DrawerRegister.vue';
import DrawerEdit from '@/components/Productos/DrawerEdit.vue';
import DialogDelete from '@/components/ui/DialogDelete.vue';
import { useNotificaciones } from '@/componsables/useNotificaciones';
import { formatearMonto } from '@/utils/formatters';

// --- Configuración de la vista ---
const { showSuccess, showError } = useNotificaciones();

const items = [{ label: 'Productos', route: '/productos' }];

// --- Funciones de los Modales ---
const isDrawerRegisterOpen = ref<boolean>(false);
const isDrawerEditOpen = ref<boolean>(false);
const confirmDialogRef = ref<InstanceType<typeof DialogDelete> | null>(null);

const handleEditRequest = async (item: Producto) => {
  selectedProducto.value = item;
  if (selectedProducto.value) {
    isDrawerEditOpen.value = true;
  }
};

const handleDeleteRequest = (item: Producto) => {
  const info = {
    'Nombre del producto': item.nombre,
    Categoría: item.categoria,
    Precio: `${formatearMonto(item.precio)} Bs`,
    Stock: item.conteo ? `${item.stock} unidades` : '\u221E Infinito',
  };
  confirmDialogRef.value.openConfirm(item, info);
};

// --- Operaciones con la API ---
const productos = ref<Producto[]>([]);
const selectedProducto = ref<Producto>({
  nombre: '',
  categoria: '',
  precio: 0.0,
  conteo: false,
  stock: 0,
});

const create = async (producto: Producto) => {
  try {
    const res = await productosService.create(producto);
    showSuccess(res.message);
    await getAll();
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const getAll = async () => {
  try {
    const res = await productosService.getAll();
    productos.value = res.data;
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const update = async (producto: Producto) => {
  try {
    const res = await productosService.update(producto);
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
      <Button @click="isDrawerRegisterOpen = true" label="Nuevo producto" icon="fi-br-plus-small" size="small" class="flex! h-9! items-center! shadow-xs!" />
    </div>
    <TableGrid :data="productos" @edit="handleEditRequest" @delete="handleDeleteRequest" />
    <DrawerEdit v-model:visible="isDrawerEditOpen" :producto="selectedProducto" @confirm-edit="update" />
    <DrawerRegister v-model:visible="isDrawerRegisterOpen" @confirm-create="create" />
    <DialogDelete ref="confirmDialogRef" @confirm-delete="remove" />
  </div>
</template>
