<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Jornada, JornadaActual } from '@/types/jornadas.types';
import type { Venta } from '@/types/ventas.types';
import Breadcrumb from '@/components/ui/CustomBreadcrumb.vue';
import CustomCard from '@/components/ui/CustomCard.vue';
import SalesDataList from '@/components/Jornadas/SalesDataList.vue';
import WorkdayOpenDialog from '@/components/Jornadas/WorkdayOpenDialog.vue';
import WorkdayCloseDialog from '@/components/Jornadas/WorkdayCloseDialog.vue';
import DialogDelete from '@/components/ui/DialogDelete.vue';
import SaleDetailsDrawer from '@/components/Jornadas/SaleDetailsDrawer.vue';
import jornadasService from '@/api/services/jornadas.service';
import ventasService from '@/api/services/ventas.service';
import { useNotifications } from '@/componsables/useNotificaciones';
import { formatCurrency, formatTinyDate } from '@/utils/formatters';
import { useAuthStore } from '@/stores/auth.store';

// --- Configuración de la vista ---
const { showSuccess, showError } = useNotifications();

const authStore = useAuthStore();
const userRole = authStore.user?.rol || 'USER';

const items = [{ label: 'Jornadas', route: '/jornadas' }];

// --- Funciones de los Modales ---
const isDialogRegisterOpen = ref<boolean>(false);
const isDialogEditOpen = ref<boolean>(false);
const confirmDialogRef = ref<any>(null);
const removeType = ref<'jornada' | 'venta' | null>(null);

const handleDeleteWorkdayRequest = (item: JornadaActual) => {
  removeType.value = 'jornada';
  const info = {
    Apertura: formatTinyDate(item?.abierta_desde),
    'Fondo inicial': formatCurrency(item.fondo_inicial),
    'Ventas en efectivo': formatCurrency(item.ventas_efectivo || 0),
    'Total esperado': formatCurrency(item.total_esperado || 0),
  };
  confirmDialogRef.value.openConfirm(item, info);
};

const handleDeleteSaleRequest = (item: Venta) => {
  removeType.value = 'venta';
  const info = {
    'Hora de la venta': formatTinyDate(item?.created_at),
    Total: formatCurrency(item.total || 0),
    Estatus: item.estatus === 'CONTADO' ? 'De contado' : 'A crédito',
  };
  confirmDialogRef.value.openConfirm(item, info);
};

const handleConfirmDelete = async (id: number) => {
  if (removeType.value === 'jornada') {
    await remove(id);
  } else if (removeType.value === 'venta') {
    await removeVenta(id);
  }
};

const isSaleDatailsDrawerOpen = ref(false);
const selectedSale = ref<Venta | null>(null);

const handleView = async (venta: Venta) => {
  selectedSale.value = await getVenta(venta.id);
  if (selectedSale.value) {
    isSaleDatailsDrawerOpen.value = true;
  }
};

// --- Operaciones con la API ---
const workday = ref<JornadaActual | null>(null);

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
    const res = (await jornadasService.getActual()) || null;
    workday.value = res.data;
  } catch (error: any) {
    if (error.response.status === 404) return;
    showError(error.response.data.message);
  }
};

const update = async (jornada: Jornada) => {
  try {
    const res = await jornadasService.update(jornada);
    showSuccess(res.message);
  } catch (error: any) {
    showError(error.response.data.message);
  } finally {
    await getActual();
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

// --- Ventas ---
const getVenta = async (id: Venta['id']) => {
  try {
    const res = await ventasService.getById(id);
    return res.data;
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const removeVenta = async (id: Venta['id']) => {
  try {
    const res = await ventasService.remove(id);
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
          <i class="fi-sr-calendar"></i>
        </div>
        <h2 class="text-lg font-extrabold dark:text-zinc-200">Jornada en curso</h2>
      </div>
      <div class="flex items-center gap-3">
        <Button
          as="router-link"
          to="/jornadas/historial"
          label="Historial"
          icon="fi-br-time-forward"
          severity="secondary"
          outlined
          size="small"
          class="flex! h-9! items-center! shadow-xs!"
        />
        <Button
          v-if="!workday?.id && userRole === 'ADMIN'"
          @click="isDialogRegisterOpen = true"
          label="Abrir jornada"
          icon="fi-br-calendar-arrow-up"
          size="small"
          class="flex! h-9! items-center! shadow-xs!"
        />
        <div
          v-else-if="userRole === 'ADMIN'"
          class="flex items-center gap-3"
        >
          <Button
            @click="handleDeleteWorkdayRequest(workday as JornadaActual)"
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
    <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
      <CustomCard
        variant="success"
        title="Ventas de hoy"
        :value="workday?.id ? formatCurrency(workday?.ventas_efectivo || 0) : '-'"
        subtitle="Total acumulado en el mostrador"
        icon="fi-br-arrow-trend-up"
      />
      <CustomCard
        title="Total físico esperado"
        :value="workday?.id ? formatCurrency(workday?.total_esperado || 0) : '-'"
        subtitle="Fondo inicial + Ventas"
        icon="fi-rr-calculator"
      />
      <CustomCard
        title="Abierta desde"
        :value="formatTinyDate(workday?.abierta_desde || null)"
        subtitle="Hora de apertura"
        icon="fi-br-clock"
      />
    </div>
    <SalesDataList
      :ventas="workday?.ventas"
      @view="handleView"
      @delete="handleDeleteSaleRequest"
    />
  </div>
  <div>
    <SaleDetailsDrawer
      v-model:visible="isSaleDatailsDrawerOpen"
      :venta="selectedSale"
    />
    <WorkdayOpenDialog
      v-model:visible="isDialogRegisterOpen"
      @confirm-create="create"
    />
    <WorkdayCloseDialog
      v-model:visible="isDialogEditOpen"
      :jornada-id="workday?.id"
      @confirm-edit="update"
    />
    <DialogDelete
      ref="confirmDialogRef"
      @confirm-delete="handleConfirmDelete"
    />
  </div>
</template>
