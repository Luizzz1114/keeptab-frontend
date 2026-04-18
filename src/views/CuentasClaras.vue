<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Cliente } from '@/types/clientes.types';
import Breadcrumb from '@/components/ui/CustomBreadcrumb.vue';
import TableGrid from '@/components/Clientes/TableGrid.vue';
import DrawerRegister from '@/components/Clientes/DrawerRegister.vue';
import DrawerEdit from '@/components/Clientes/DrawerEdit.vue';
import DialogDelete from '@/components/ui/DialogDelete.vue';
import clientesService from '@/api/services/clientes.service';
import { useNotificaciones } from '@/componsables/useNotificaciones';

// --- Configuración de la vista ---
const { showSuccess, showError } = useNotificaciones();

const items = [{ label: 'Cuentas claras', route: '/cuentas' }];

// --- Funciones de los Modales ---
const isDrawerRegisterOpen = ref<boolean>(false);
const isDrawerEditOpen = ref<boolean>(false);
const confirmDialogRef = ref<any>(null);

const handleEditRequest = async (item: Cliente) => {
  selectedCliente.value = item;
  console.log(selectedCliente.value);
  if (selectedCliente.value) {
    isDrawerEditOpen.value = true;
  }
};

const handleDeleteRequest = (item: Cliente) => {
  const info = {
    Nombre: item.nombre,
    Cédula: item.cedula,
    Contacto: item.contacto,
  };
  confirmDialogRef.value.openConfirm(item, info);
};

// --- Operaciones con la API ---
const clientes = ref<Cliente[]>([]);
const selectedCliente = ref<Cliente>({
  id: undefined,
  nombre: '',
  cedula: '',
  contacto: '',
});

const create = async (cliente: Cliente) => {
  try {
    const res = await clientesService.create(cliente);
    showSuccess(res.message);
    await getAll();
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const getAll = async () => {
  try {
    const res = await clientesService.getAll();
    clientes.value = res.data;
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const update = async (cliente: Cliente) => {
  try {
    const res = await clientesService.update(cliente);
    showSuccess(res.message);
    await getAll();
  } catch (error: any) {
    console.log(error.response.data.message);
  }
};

const remove = async (id: Cliente['id']) => {
  try {
    const res = await clientesService.remove(id);
    showSuccess(res.message);
    await getAll();
  } catch (error: any) {
    console.log(error.response.data.message);
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
          <i class="fi-sr-users"></i>
        </div>
        <h2 class="text-lg font-extrabold dark:text-zinc-200">Cuentas claras</h2>
      </div>
      <Button
        @click="isDrawerRegisterOpen = true"
        label="Nuevo cliente"
        icon="fi-br-plus-small"
        size="small"
        class="flex! h-9! items-center! shadow-xs!"
      />
    </div>
    <TableGrid
      :data="clientes"
      @edit="handleEditRequest"
      @delete="handleDeleteRequest"
    />
    <DrawerRegister
      v-model:visible="isDrawerRegisterOpen"
      @confirm-create="create"
    />
    <DrawerEdit
      v-model:visible="isDrawerEditOpen"
      :cliente="selectedCliente"
      @confirm-edit="update"
    />
    <DialogDelete
      ref="confirmDialogRef"
      @confirm-delete="remove"
    />
  </div>
</template>
