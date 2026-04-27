<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatCurrency, formatTinyDate } from '@/utils/formatters';
import type { Venta } from '@/types/ventas.types';
import type { Cliente } from '@/types/clientes.types';

// --- Props y Emits ---
const visible = defineModel<boolean>('visible');

const props = defineProps<{
  cliente: Cliente | null;
}>();

const emit = defineEmits<{
  (e: 'registrar-abono', payload: { venta_id: number | undefined; monto: number }): void;
}>();

// --- Lógica de Abonos ---
const isAbonoModalOpen = ref(false);
const ventaSeleccionada = ref<Venta | null>(null);
const montoAbono = ref<number | null>(null);

const abrirModalAbono = (venta: Venta) => {
  ventaSeleccionada.value = venta;
  montoAbono.value = null;
  isAbonoModalOpen.value = true;
};

const confirmarAbono = () => {
  if (ventaSeleccionada.value && montoAbono.value && montoAbono.value > 0) {
    emit('registrar-abono', {
      venta_id: ventaSeleccionada.value.id,
      monto: montoAbono.value,
    });
    isAbonoModalOpen.value = false;
    visible.value = false;
  }
};

// --- Cálculos ---
const calcularRestante = (venta: Venta) => {
  const total = venta.total || 0;
  const abonado = venta.abonos?.reduce((acc, abono) => acc + (Number(abono.monto) || 0), 0) || 0;
  return total - abonado;
};

const deudaTotal = computed(() => {
  if (!props.cliente?.ventas) return 0;
  return props.cliente.ventas
    .filter((v) => v.estatus === 'CREDITO')
    .reduce((acc, venta) => acc + calcularRestante(venta), 0);
});
</script>

<template>
  <Drawer
    v-model:visible="visible"
    position="right"
    :dismissable="false"
    class="m-2! h-[calc(100dvh-1rem)]! w-[calc(100%-1rem)]! overflow-hidden rounded-2xl! border! md:w-180!"
  >
    <template #container="{ closeCallback }">
      <div
        class="flex h-16 items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-700"
      >
        <div class="flex items-center gap-3">
          <div class="grid size-9 place-items-center rounded-lg bg-emerald-500 text-lg text-white">
            <i class="fi-sr-user"></i>
          </div>
          <span class="text-lg! font-bold dark:text-zinc-200">Detalles del cliente</span>
        </div>
        <Button
          @click="closeCallback"
          icon="fi-br-cross"
          severity="secondary"
          class="size-8! *:text-xs!"
        />
      </div>

      <div
        v-if="cliente"
        class="flex h-full flex-col overflow-hidden"
      >
        <div class="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
          <div
            class="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-xs ring-2 ring-white ring-inset sm:grid-cols-3 dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
          >
            <div class="flex items-center gap-2 sm:col-span-3">
              <i class="fi-br-info text-base text-emerald-500"></i>
              <span class="text-sm! font-extrabold uppercase">Información general</span>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500">Nombre</span>
              <span class="font-medium text-zinc-700 dark:text-zinc-200">{{ cliente.nombre }}</span>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500">Cédula</span>
              <span class="font-medium text-zinc-700 dark:text-zinc-200">{{
                cliente.cedula || 'N/A'
              }}</span>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500">Contacto</span>
              <span class="font-medium text-zinc-700 dark:text-zinc-200">{{
                cliente.contacto || 'N/A'
              }}</span>
            </div>

            <div class="flex flex-col items-start gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500">Estado</span>
              <Tag
                :value="deudaTotal > 0 ? 'Pendiente' : 'Al día'"
                :severity="deudaTotal > 0 ? 'warn' : 'success'"
                class="h-5! ring ring-current/10 ring-inset *:text-xs!"
              />
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="text-sm! font-semibold text-zinc-400 dark:text-zinc-500"
                >Total adeudado</span
              >
              <span class="font-bold text-zinc-700 dark:text-zinc-200">{{
                formatCurrency(deudaTotal)
              }}</span>
            </div>
          </div>

          <div
            class="flex flex-col gap-1.5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 pb-5 shadow-xs ring-2 ring-white ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
          >
            <div class="flex items-center gap-2">
              <i class="fi-br-receipt text-base text-emerald-500"></i>
              <span class="text-sm! font-extrabold uppercase"
                >Historial de ventas ({{ cliente.ventas?.length || 0 }})</span
              >
            </div>

            <div class="flex flex-col">
              <template v-if="cliente.ventas && cliente.ventas.length > 0">
                <div
                  v-for="venta in cliente.ventas"
                  :key="venta.id"
                  class="flex flex-col gap-3 border-b border-zinc-200 py-3 last:border-0 last:pb-0 dark:border-zinc-700/50"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div
                        class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-200/50 text-zinc-500 dark:bg-zinc-400/10 dark:text-zinc-300"
                      >
                        <i
                          :class="
                            venta.estatus === 'CONTADO' ? 'fi-rr-check-circle' : 'fi-rr-time-fast'
                          "
                        ></i>
                      </div>
                      <div class="flex flex-col">
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-bold text-zinc-700 dark:text-zinc-200">
                            {{ venta.estatus === 'CONTADO' ? 'Venta' : 'A crédito' }} #{{
                              venta.id
                            }}
                          </span>
                        </div>
                        <span class="text-[11px]! text-zinc-500 dark:text-zinc-400">
                          {{ formatTinyDate(venta.fecha) }}
                        </span>
                      </div>
                    </div>
                    <div class="flex flex-col items-end">
                      <span class="text-base font-semibold text-zinc-700 dark:text-zinc-200">{{
                        formatCurrency(venta.total)
                      }}</span>
                      <Tag
                        v-if="venta.estatus === 'CREDITO'"
                        :value="'Resta: ' + formatCurrency(calcularRestante(venta))"
                        severity="warn"
                        class="h-5! ring ring-current/10 ring-inset *:text-xs!"
                      />
                    </div>
                  </div>

                  <div
                    v-if="
                      venta.estatus === 'CREDITO' && venta.detalles && venta.detalles.length > 0
                    "
                  >
                    <div
                      class="flex flex-col gap-2 rounded-xl bg-white p-3 ring-1 ring-zinc-200 ring-inset dark:bg-zinc-900/50 dark:ring-zinc-700/50"
                    >
                      <span
                        class="text-xs! font-extrabold text-zinc-400 uppercase dark:text-zinc-500"
                        >Productos adeudados</span
                      >
                      <div class="flex flex-col">
                        <div
                          v-for="detalle in venta.detalles"
                          :key="detalle.id"
                          class="flex items-center justify-between border-b border-zinc-100 py-2 first:pt-0 last:border-0 last:pb-0 dark:border-zinc-800"
                        >
                          <div class="flex flex-col">
                            <span class="font-bold text-zinc-700 dark:text-zinc-200">{{
                              detalle.producto?.nombre
                            }}</span>
                            <span class="text-[11px]! text-zinc-500 dark:text-zinc-400">
                              {{ detalle.cantidad }} unid. x
                              {{ formatCurrency(detalle.precio_unitario || 0) }}
                            </span>
                          </div>
                          <span class="text-sm! font-bold text-zinc-600 dark:text-zinc-300">
                            {{ formatCurrency(detalle.subtotal || 0) }}
                          </span>
                        </div>
                      </div>
                      <div
                        v-if="venta.estatus === 'CREDITO'"
                        class="flex justify-end"
                      >
                        <Button
                          @click="abrirModalAbono(venta)"
                          label="Recibir abono"
                          size="small"
                          severity="secondary"
                          outlined
                          class="flex! h-8! items-center! shadow-xs!"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <div
                v-else
                class="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400"
              >
                Este cliente no tiene ventas registradas.
              </div>
            </div>
          </div>
        </div>

        <div
          class="flex h-16 shrink-0 items-center justify-end gap-3 border-t border-zinc-200 p-4 dark:border-zinc-700"
        >
          <Button
            @click="closeCallback"
            label="Cerrar"
            type="button"
            size="small"
            severity="secondary"
          />
        </div>
      </div>
    </template>
  </Drawer>

  <Dialog
    v-model:visible="isAbonoModalOpen"
    modal
    class="w-11/12 max-w-md overflow-hidden rounded-2xl!"
  >
    <template #container="{ closeCallback }">
      <div class="relative flex items-center justify-between p-6 dark:border-zinc-700">
        <div class="flex w-full flex-col items-center justify-center gap-2">
          <div
            class="grid size-10 place-items-center rounded-xl border border-emerald-200 bg-emerald-100 text-lg dark:border-emerald-500/20 dark:bg-emerald-500/10"
          >
            <i class="fi-sr-coins text-xl text-emerald-500"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-lg! font-bold dark:text-zinc-100">Registrar Abono</span>
          </div>
        </div>
        <Button
          @click="closeCallback"
          icon="fi-br-cross"
          severity="secondary"
          class="absolute! top-6 right-6 size-8! *:text-xs!"
        />
      </div>

      <div class="flex h-full flex-col overflow-hidden">
        <div class="flex flex-1 flex-col gap-3 overflow-y-auto p-6 pt-0">
          <div
            class="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 pb-5 shadow-xs ring-2 ring-white ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
          >
            <span class="text-center text-sm text-zinc-500 dark:text-zinc-400">
              Ingresa el monto a abonar para la venta
              <strong class="text-zinc-600 dark:text-zinc-300">#{{ ventaSeleccionada?.id }}</strong
              >. Monto restante:
              <strong class="text-zinc-600 dark:text-zinc-300">{{
                formatCurrency(calcularRestante(ventaSeleccionada!))
              }}</strong>
            </span>
            <div class="flex flex-col gap-0.5">
              <label for="montoAbono">Monto <span class="text-red-500">*</span></label>
              <InputGroup>
                <InputGroupAddon class="h-9! text-sm! font-semibold">Bs.</InputGroupAddon>
                <InputNumber
                  v-model="montoAbono"
                  inputId="montoAbono"
                  mode="decimal"
                  locale="es-VE"
                  :minFractionDigits="2"
                  :maxFractionDigits="2"
                  :min="0.1"
                  :max="calcularRestante(ventaSeleccionada!)"
                  autocomplete="off"
                  size="small"
                  fluid
                  autofocus
                />
              </InputGroup>
            </div>
          </div>
        </div>

        <div class="flex w-full items-center justify-center gap-3 p-6 pt-0">
          <Button
            @click="closeCallback"
            label="Cancelar"
            type="button"
            size="small"
            severity="secondary"
            class="min-w-20"
          />
          <Button
            @click="confirmarAbono"
            label="Guardar abono"
            :disabled="!montoAbono || montoAbono <= 0"
            type="button"
            size="small"
            class="min-w-18"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>
