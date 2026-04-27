<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Cliente } from '@/types/clientes.types';
import type { Abono } from '@/types/abonos.types';
import Breadcrumb from '@/components/ui/CustomBreadcrumb.vue';
import ClientsDataView from '@/components/Clientes/ClientsDataView.vue';
import ClientCreateDrawer from '@/components/Clientes/ClientCreateDrawer.vue';
import ClientDetailsDrawer from '@/components/Clientes/ClientDetailsDrawer.vue';
import ClientEditDrawer from '@/components/Clientes/ClientEditDrawer.vue';
import DialogDelete from '@/components/ui/DialogDelete.vue';
import clientesService from '@/api/services/clientes.service';
import abonosService from '@/api/services/abonos.service';
import { useNotifications } from '@/composables/useNotifications';

// --- Configuración de la vista ---
const { showSuccess, showError } = useNotifications();

const items = [{ label: 'Cuentas claras', route: '/cuentas' }];

// --- Funciones de los Modales ---
const isDrawerOpen = ref<boolean>(false);
const isDrawerRegisterOpen = ref<boolean>(false);
const isDrawerEditOpen = ref<boolean>(false);
const confirmDialogRef = ref<any>(null);

const handleViewRequest = async (item: Cliente) => {
  selectedCliente.value = await getById(item.id);
  if (selectedCliente.value) {
    isDrawerOpen.value = true;
  }
};

const handleEditRequest = async (item: Cliente) => {
  selectedCliente.value = item;
  if (selectedCliente.value) {
    isDrawerEditOpen.value = true;
  }
};

const handleDeleteRequest = (item: Cliente) => {
  const info = {
    Nombre: item.nombre,
    Cédula: item.cedula,
    Contacto: item.contacto || 'N/A',
  };
  confirmDialogRef.value.openConfirm(item, info);
};

// --- Operaciones con la API ---
const clientes = ref<Cliente[]>([]);
const selectedCliente = ref<any>(null);

const create = async (cliente: Cliente) => {
  try {
    const res = await clientesService.create(cliente);
    showSuccess(res.message);
    await getAll();
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const RegistrarAbono = async (abono: Abono) => {
  try {
    const res = await abonosService.create(abono);
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

const getById = async (id: Cliente['id']) => {
  try {
    const res = await clientesService.getById(id);
    return res.data;
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
    showError(error.response.data.message);
  }
};

const remove = async (id: Cliente['id']) => {
  try {
    const res = await clientesService.remove(id);
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
    <ClientsDataView
      :data="clientes"
      @view="handleViewRequest"
      @edit="handleEditRequest"
      @delete="handleDeleteRequest"
    />
    <ClientDetailsDrawer
      v-model:visible="isDrawerOpen"
      :cliente="selectedCliente"
      @registrar-abono="RegistrarAbono"
    />
    <ClientCreateDrawer
      v-model:visible="isDrawerRegisterOpen"
      @confirm-create="create"
    />
    <ClientEditDrawer
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
