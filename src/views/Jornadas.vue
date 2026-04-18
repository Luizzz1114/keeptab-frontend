<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Jornada, JornadaActual } from '@/types/jornadas.types';
import Breadcrumb from '@/components/ui/CustomBreadcrumb.vue';
import CustomCard from '@/components/ui/CustomCard.vue';
import AbrirJornadaDialog from '@/components/Jornadas/AbrirJornadaDialog.vue';
import CerrarJornadaDialog from '@/components/Jornadas/CerrarJornadaDialog.vue';
import jornadasService from '@/api/services/jornadas.service';
import { useNotificaciones } from '@/componsables/useNotificaciones';
import { formatearMonto, formatTinyDate } from '@/utils/formatters';
import DialogDelete from '@/components/ui/DialogDelete.vue';

// --- Configuración de la vista ---
const { showSuccess, showError, showWarning } = useNotificaciones();

const items = [{ label: 'Jornadas', route: '/jornadas' }];

// --- Funciones de los Modales ---
const isDialogRegisterOpen = ref<boolean>(false);
const isDialogEditOpen = ref<boolean>(false);
const confirmDialogRef = ref<any>(null);

const handleDeleteRequest = (item: JornadaActual) => {
  const info = {
    Apertura: formatTinyDate(item?.abierta_desde),
    'Fondo inicial': `${formatearMonto(item.fondo_inicial || 0)} Bs`,
    'Ventas en efectivo': `${formatearMonto(item.ventas_efectivo || 0)} Bs`,
    'Total esperado': `${formatearMonto(item.total_esperado || 0)} Bs`,
  };
  confirmDialogRef.value.openConfirm(item, info);
};

// --- Operaciones con la API ---
const jornadaActual = ref<JornadaActual>({});

const create = async (jornada: Jornada) => {
  try {
    const res = await jornadasService.create(jornada);
    showSuccess(res.message);
    await getActual();
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const getActual = async () => {
  try {
    const res = await jornadasService.getActual();
    jornadaActual.value = res.data;
  } catch (error: any) {
    jornadaActual.value = {};
    if (error.response.status === 404) {
      return;
    }
    showError(error.response.data.message);
  }
};

const update = async (jornada: Jornada) => {
  try {
    const res = await jornadasService.update(jornada);
    showSuccess(res.message);
    await getActual();
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const remove = async (id: Jornada['id']) => {
  try {
    const res = await jornadasService.remove(id);
    showSuccess(res.message);
    await getActual();
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

onMounted(async () => {
  await getActual();
});
</script>

<template>
  <div class="flex flex-col">
    <Breadcrumb :items="items" />
    <div class="mt-4 mb-4 flex flex-wrap justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="grid size-9 place-items-center rounded-lg bg-emerald-500 text-lg text-white">
          <i class="fi-sr-calculator"></i>
        </div>
        <h2 class="text-lg font-extrabold dark:text-zinc-200">Jornada en curso</h2>
      </div>
      <div class="flex items-center gap-3">
        <Button
          label="Historial"
          icon="fi-br-time-forward"
          severity="secondary"
          outlined
          size="small"
          class="flex! h-9! items-center! shadow-xs!"
        />
        <Button
          v-if="!jornadaActual?.id"
          @click="isDialogRegisterOpen = true"
          label="Abrir jornada"
          icon="fi-br-calendar-arrow-up"
          size="small"
          class="flex! h-9! items-center! shadow-xs!"
        />
        <div
          v-else
          class="flex items-center gap-3"
        >
          <Button
            @click="handleDeleteRequest(jornadaActual)"
            icon="fi-br-trash"
            outlined
            size="small"
            severity="secondary"
            class="flex! size-9! shadow-xs!"
          />
          <Button
            @click="isDialogEditOpen = true"
            label="Cerrar jornada"
            icon="fi-br-calendar-arrow-down"
            size="small"
            class="flex! h-9! items-center! shadow-xs!"
          />
        </div>
      </div>
    </div>
    <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <CustomCard
        variant="success"
        title="Ventas de hoy"
        :value="jornadaActual.id ? `${formatearMonto(jornadaActual.ventas_efectivo || 0)} Bs` : '-'"
        subtitle="Total acumulado en el mostrador"
        icon="fi-br-arrow-trend-up"
      />
      <CustomCard
        title="Total físico esperado"
        :value="jornadaActual.id ? `${formatearMonto(jornadaActual.total_esperado || 0)} Bs` : '-'"
        subtitle="Fondo inicial + Ventas"
        icon="fi-rr-calculator"
      />
      <CustomCard
        title="Abierta desde"
        :value="formatTinyDate(jornadaActual?.abierta_desde || null)"
        subtitle="Hora de apertura"
        icon="fi-br-clock"
      />
    </div>
    <AbrirJornadaDialog
      v-model:visible="isDialogRegisterOpen"
      @confirm-create="create"
    />
    <CerrarJornadaDialog
      v-model:visible="isDialogEditOpen"
      :jornada-id="jornadaActual?.id"
      @confirm-edit="update"
    />
    <DialogDelete
      ref="confirmDialogRef"
      @confirm-delete="remove"
    />
  </div>
</template>
