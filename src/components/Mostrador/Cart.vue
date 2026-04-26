<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Cliente } from '@/types/clientes.types';
import type { Venta } from '@/types/ventas.types';
import type { CartItem } from '@/types/productos.types';
import { formatCurrency } from '@/utils/formatters';

const props = defineProps<{ cart: CartItem[]; clients: Cliente[] }>();

const emit = defineEmits<{
  (e: 'increase-qty', item: CartItem): void;
  (e: 'decrease-qty', item: CartItem): void;
  (e: 'remove-item', item: CartItem): void;
  (e: 'confirmVenta', data: Venta): void;
}>();

const isMobileOpen = ref(false);
const selectedClient = ref();
const isClientInvalid = ref(false);

const cartTotal = computed(() => {
  return props.cart.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
});

const resetForm = () => {
  isClientInvalid.value = false;
  selectedClient.value = undefined;
};

const closeCart = () => {
  isMobileOpen.value = false;
  resetForm();
};

const procesar = (estatus: 'CREDITO' | 'CONTADO') => {
  if (props.cart.length === 0) return;
  if (estatus === 'CREDITO' && !selectedClient.value) {
    isClientInvalid.value = true;
    return;
  }

  const formattedDetails = props.cart.map((item) => ({
    cantidad: item.cantidad,
    producto_id: item.producto.id,
  }));
  const payload: Venta = {
    detalles: formattedDetails,
    cliente_id: selectedClient.value,
    total: cartTotal.value,
    estatus,
  };
  emit('confirmVenta', payload);
  resetForm();
  closeCart();
};
</script>

<template>
  <div
    v-if="!isMobileOpen && cart.length > 0"
    class="fixed bottom-4 left-0 z-10 flex w-full justify-center px-4 lg:hidden"
  >
    <Button
      @click="isMobileOpen = true"
      class="flex items-center justify-between rounded-xl! border-none! bg-emerald-500! p-2! shadow-lg transition-all hover:bg-emerald-600!"
    >
      <div class="flex items-center gap-3">
        <div class="flex size-7 items-center justify-center rounded-lg bg-white/20 text-sm font-extrabold text-white ring-1 ring-white/30">
          {{ cart.reduce((acc, item) => acc + item.cantidad, 0) }}
        </div>
        <span class="font-bold tracking-wide text-white">Ver Carrito</span>
      </div>
      <span class="mr-1 text-xl font-black tracking-tight text-white"> {{ formatCurrency(cartTotal) }}</span>
    </Button>
  </div>

  <div
    :class="isMobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'"
    @click="closeCart"
    class="fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 lg:hidden"
  ></div>

  <div
    :class="isMobileOpen ? 'translate-x-0' : 'translate-x-[120%]'"
    class="fixed inset-0 z-70 m-auto flex h-[calc(100%-1rem)] lg:h-full! w-[calc(100%-1rem)] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xs transition-transform duration-300 ease-[ease] lg:static lg:w-100 lg:translate-x-0 dark:border-zinc-700 dark:bg-zinc-900"
  >
    <div class="flex h-16 shrink-0 items-center justify-between border-b border-dashed border-zinc-200 p-4 dark:border-zinc-700">
      <div class="flex items-center gap-3">
        <div class="grid size-9 place-items-center rounded-lg bg-emerald-500 text-lg text-white">
          <i class="fi-sr-receipt"></i>
        </div>
        <div class="flex flex-col">
          <span class="text-lg! font-bold dark:text-zinc-200">Recibo Actual</span>
        </div>
        <span class="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {{ cart.length }} items
        </span>
      </div>
      <Button
        @click="closeCart"
        icon="fi-br-cross"
        severity="secondary"
        class="size-8! *:text-xs! lg:hidden!"
      />
    </div>
    <div class="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
      <div
        v-if="cart.length === 0"
        class="flex h-full flex-col items-center justify-center gap-3 text-zinc-400 dark:text-zinc-600"
      >
        <i class="fi-rr-shopping-cart text-3xl"></i>
        <span class="text-sm font-medium">El carrito está vacío</span>
      </div>
      <div
        v-for="item in cart"
        :key="item.producto.id"
        class="flex flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-3 shadow-xs ring-2 ring-white ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
      >
        <div class="mb-3 flex items-start justify-between">
          <div>
            <h3 class="text-sm font-bold text-zinc-700 dark:text-zinc-100">{{ item.producto.nombre }}</h3>
            <p class="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{{ formatCurrency(item.producto.precio) }} c/u</p>
          </div>
          <span class="text-sm font-black text-zinc-700 dark:text-white">{{ formatCurrency(item.producto.precio * item.cantidad) }}</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-900">
            <Button
              @click="emit('decrease-qty', item)"
              icon="fi-br-minus text-xs!"
              severity="secondary"
              class="size-7!"
            />
            <span
              class="w-7 text-center text-sm font-bold text-zinc-700 dark:text-zinc-100"
              aria-live="polite"
              >{{ item.cantidad }}</span
            >
            <Button
              @click="emit('increase-qty', item)"
              icon="fi-br-plus text-xs!"
              severity="secondary"
              class="size-7!"
            />
          </div>
          <Button
            @click="emit('remove-item', item)"
            icon="fi-rr-trash text-base!"
            severity="danger"
            class="size-8!"
          />
        </div>
      </div>
    </div>
    <div class="flex shrink-0 flex-col gap-4 border-t border-dashed border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <div class="flex flex-col gap-1">
        <Select
          v-model="selectedClient"
          :options="clients"
          optionLabel="nombre"
          optionValue="id"
          placeholder="Seleccionar cliente"
          size="small"
          :invalid="isClientInvalid"
          @change="isClientInvalid = false"
          class="w-full"
        />
        <Message
          v-if="isClientInvalid"
          severity="error"
          size="small"
          variant="simple"
        >
          Debe seleccionar un cliente para poder vender a crédito
        </Message>
      </div>
      <div class="flex items-end justify-between">
        <span class="text-lg font-bold text-zinc-700 uppercase dark:text-zinc-100">Total</span>
        <span class="text-xl font-black tracking-tight text-zinc-700 dark:text-white">{{ formatCurrency(cartTotal) }}</span>
      </div>
      <div class="flex gap-3 *:flex-1">
        <Button
          label="A crédito"
          icon="fi-rr-memo-pad text-base!"
          severity="secondary"
          @click="procesar('CREDITO')"
          :disabled="cart.length === 0"
        />
        <Button
          label="Al contado"
          icon="fi-rr-money-bills-simple text-lg!"
          @click="procesar('CONTADO')"
          :disabled="cart.length === 0"
        />
      </div>
    </div>
  </div>
</template>
