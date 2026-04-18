<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Cliente } from '@/types/clientes.types';
import type { Producto, CartItem } from '@/types/productos.types';
import Breadcrumb from '@/components/ui/CustomBreadcrumb.vue';
import GridProductos from '@/components/Mostrador/GridProductos.vue';
import productosService from '@/api/services/productos.service';
import { useNotificaciones } from '@/componsables/useNotificaciones';
import Carrito from '@/components/Mostrador/Carrito.vue';
import clientesService from '@/api/services/clientes.service';
import ventasService from '@/api/services/ventas.service';
import type { Venta } from '@/types/ventas.types';
import jornadasService from '@/api/services/jornadas.service';
import type { JornadaActual } from '@/types/jornadas.types';
import ErrorJornadaDialog from '@/components/Jornadas/ErrorJornadaDialog.vue';

// --- Configuración de la vista ---
const { showSuccess, showError, showWarning } = useNotificaciones();

// --- Operaciones con la API ---
const productos = ref<Producto[]>([]);
const clientes = ref<Cliente[]>([]);
const jornada = ref<JornadaActual>();
const cart = ref<CartItem[]>([]);
const mostrarAdvertencia = ref<boolean>(false);

const getProductos = async () => {
  try {
    const res = await productosService.getAll();
    productos.value = res.data;
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const getClientes = async () => {
  try {
    const res = await clientesService.getAll();
    clientes.value = res.data;
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

const getJornadaActual = async () => {
  try {
    const res = await jornadasService.getActual();
    jornada.value = res.data;
  } catch (error: any) {
    if (error.response.status === 404) {
      mostrarAdvertencia.value = true;
      return showWarning(error.response.data.message);
    }
    showError(error.response.data.message);
  }
};

const createVenta = async (venta: Venta) => {
  try {
    const res = await ventasService.create(venta);
    showSuccess(res.message);
    await getProductos();
    cart.value = [];
  } catch (error: any) {
    showError(error.response.data.message);
  }
};

onMounted(async () => {
  await Promise.allSettled([getJornadaActual(), getClientes(), getProductos()]);
});

// --- Lógica del Carrito ---
const handleAddToCart = (producto: Producto) => {
  const existingItem = cart.value.find((item) => item.producto.id === producto.id);
  if (existingItem) {
    if (producto.conteo && producto.stock !== null) {
      if (existingItem.cantidad < producto.stock) {
        existingItem.cantidad++;
      } else {
        showWarning(`Stock máximo alcanzado para ${producto.nombre}`);
      }
    } else {
      existingItem.cantidad++;
    }
  } else {
    cart.value.push({ producto, cantidad: 1 });
  }
};

const handleIncrease = (item: CartItem) => {
  const cartItem = cart.value.find((i) => i.producto.id === item.producto.id);
  if (cartItem) {
    if (!cartItem.producto.conteo || (cartItem.producto.stock !== null && cartItem.cantidad < cartItem.producto.stock)) {
      cartItem.cantidad++;
    } else {
      showWarning('Stock máximo alcanzado');
    }
  }
};

const handleDecrease = (item: CartItem) => {
  const cartItem = cart.value.find((i) => i.producto.id === item.producto.id);
  if (cartItem) {
    if (cartItem.cantidad > 1) {
      cartItem.cantidad--;
    } else {
      handleRemove(item);
    }
  }
};

const handleRemove = (item: CartItem) => {
  cart.value = cart.value.filter((i) => i.producto.id !== item.producto.id);
};
</script>

<template>
  <div class="flex md:h-full md:gap-4">
    <div class="flex flex-1 flex-col">
      <Breadcrumb />
      <div class="my-4 flex flex-wrap justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="grid size-9 place-items-center rounded-lg bg-emerald-500 text-lg text-white">
            <i class="fi-sr-shopping-cart"></i>
          </div>
          <h2 class="text-lg font-extrabold dark:text-zinc-200">Mostrador</h2>
        </div>
      </div>
      <div class="mb-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs leading-tight text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-400">
        <span>Haz clic en los productos que el cliente desea llevar para armar la cuenta.</span>
      </div>
      <GridProductos :data="productos" @add-to-cart="handleAddToCart" />
    </div>
    <div class="h-full md:min-w-100">
      <Carrito :clientes="clientes" :cart="cart" @increase-qty="handleIncrease" @decrease-qty="handleDecrease" @remove-item="handleRemove" @confirm-venta="createVenta" />
    </div>
    <ErrorJornadaDialog v-model:visible="mostrarAdvertencia" />
  </div>
</template>
