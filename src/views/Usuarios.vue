<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Usuario } from '@/types/usuarios.types';
import Breadcrumb from '@/components/ui/CustomBreadcrumb.vue';
import TableGrid from '@/components/Usuarios/TableGrid.vue';
import DrawerRegister from '@/components/Usuarios/DrawerRegister.vue';
import DrawerEdit from '@/components/Usuarios/DrawerEdit.vue';
import DialogDelete from '@/components/ui/DialogDelete.vue';
import { useNotificaciones } from '@/componsables/useNotificaciones';

// --- Configuración de la vista ---
const { showSuccess, showError } = useNotificaciones();

const items = [{ label: 'Usuarios', route: '/usuarios' }];

// --- Funciones de los Modales ---
const isDrawerRegisterOpen = ref<boolean>(false);
const isDrawerEditOpen = ref<boolean>(false);
const confirmDialogRef = ref<InstanceType<typeof DialogDelete> | null>(null);

const handleEditRequest = async (item: Usuario) => {
  selectedUsuario.value = item;
  if (selectedUsuario.value) {
    isDrawerEditOpen.value = true;
  }
};

const handleDeleteRequest = (item: Usuario) => {
  const info = {
    'Nombre de usuarios': item.username,
    Rol: item.rol === 'ADMIN' ? 'Administrador' : 'Usuario',
  };
  confirmDialogRef.value.openConfirm(item, info);
};

// --- Operaciones con la API ---
const usuarios = ref<Usuario[]>([]);
const selectedUsuario = ref<Usuario | null>(null);

const create = async (usuario: Usuario) => {
  try {
    const res = await usuariosService.create(usuario);
    showSuccess(res.message);
    await getAll();
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const getAll = async () => {
  try {
    const res = await usuariosService.getAll();
    usuarios.value = res.data;
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const update = async (usuario: Usuario) => {
  try {
    const res = await usuariosService.update(usuario);
    showSuccess(res.message);
    await getAll();
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const remove = async (id: Usuario['id']) => {
  try {
    const res = await usuariosService.remove(id);
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
          <i class="fi-sr-user"></i>
        </div>
        <h2 class="text-lg font-extrabold dark:text-zinc-200">Usuarios</h2>
      </div>
      <Button
        @click="isDrawerRegisterOpen = true"
        label="Nuevo usuario"
        icon="fi-br-plus-small"
        size="small"
        class="flex! h-9! items-center! shadow-xs!"
      />
    </div>
    <TableGrid
      :data="usuarios"
      @edit="handleEditRequest"
      @delete="handleDeleteRequest"
    />

    <DrawerRegister
      v-model:visible="isDrawerRegisterOpen"
      @confirm-create="create"
    />
    <DrawerEdit
      v-model:visible="isDrawerEditOpen"
      :usuario="selectedUsuario"
      @confirm-edit="update"
    />
    <DialogDelete
      ref="confirmDialogRef"
      @confirm-delete="remove"
    />
  </div>
</template>
