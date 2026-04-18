<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Producto } from '@/types/productos.types';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { getProductoSchema, categoriasProductos, conteoOpciones } from '@/schemas/productos.schema';
import productosService from '@/api/services/productos.service';

const visible = defineModel<boolean>('visible');
const emit = defineEmits(['confirmEdit']);
const props = defineProps<{ producto: Producto }>();

const initialValues = computed(() => {
  const producto = props.producto;
  return {
    ...props.producto,
    precio: Number(producto.precio),
    conteo: Boolean(producto.conteo),
  };
});

const isCheckingNombre = ref(false);
const memoriaValidaciones = new Map<string, boolean>();
let debounceTimer: ReturnType<typeof setTimeout>;

const verificarNombre = (nombre: string): Promise<boolean> => {
  if (!nombre || props.producto?.nombre === nombre) {
    return Promise.resolve(true);
  }
  if (memoriaValidaciones.has(nombre)) {
    return Promise.resolve(memoriaValidaciones.get(nombre)!);
  }
  isCheckingNombre.value = true;
  return new Promise((resolve) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const response = await productosService.search(nombre);
        const disponible = response.data.length === 0;
        memoriaValidaciones.set(nombre, disponible); 
        resolve(disponible);
      } catch (error) {
        resolve(false); 
      } finally {
        isCheckingNombre.value = false;
      }
    }, 500);
  });
};

const productoSchema = getProductoSchema(verificarNombre);
const resolver = ref(zodResolver(productoSchema));

const onSubmit = (event: any) => {
  if (!event.valid) return;
  const data = event.values;
  const payload: Producto = {
    ...data,
    id: props.producto.id,
    stock: data.conteo ? data.stock : undefined,
  };
  emit('confirmEdit', payload);
  visible.value = false;
};
</script>

<template>
  <Drawer
    v-model:visible="visible"
    position="right"
    :dismissable="false"
    class="m-2! h-[calc(100dvh-1rem)]! w-[calc(100%-1rem)]! overflow-hidden rounded-2xl! border! md:w-180!"
  >
    <template #container="{ closeCallback }">
      <div class="flex h-16 items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-700">
        <div class="flex items-center gap-3">
          <div class="grid size-9 place-items-center rounded-lg bg-emerald-500 text-lg text-white">
            <i class="fi-sr-box"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-lg! font-bold dark:text-zinc-200">Editar producto</span>
          </div>
        </div>
        <Button
          @click="closeCallback"
          icon="fi-br-cross"
          severity="secondary"
          class="size-8! *:text-xs!"
        />
      </div>
      <Form
        v-slot="$form"
        :resolver="resolver"
        :initialValues="initialValues"
        :key="producto?.id"
        @submit="onSubmit"
        class="flex h-full flex-col overflow-hidden"
      >
        <div class="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
          <div
            class="grid grid-cols-1 gap-x-6 gap-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 pb-5 shadow-xs ring-2 ring-white ring-inset sm:grid-cols-2 dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
          >
            <div class="flex items-center gap-2 sm:col-span-2">
              <i class="fi-sr-circle-1 text-xl text-emerald-500"></i>
              <span class="text-base! font-bold">Información básica</span>
            </div>
            <div class="flex flex-col gap-1">
              <label for="nombre">Nombre del producto <span class="text-red-500">*</span></label>
              <IconField>
                <InputText
                  name="nombre"
                  id="nombre"
                  maxlength="50"
                  autocomplete="off"
                  size="small"
                  fluid
                />
                <InputIcon>
                  <i v-if="isCheckingNombre" class="fi-rr-spinner animate-spin text-emerald-500"></i>
                </InputIcon>
              </IconField>
              <Message
                v-if="$form.nombre?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.nombre.error?.message }}
              </Message>
            </div>
            <div class="flex flex-col gap-1">
              <span>Categoría <span class="text-red-500">*</span></span>
              <Select
                name="categoria"
                :options="categoriasProductos"
                placeholder="Seleccione"
                size="small"
                fluid
              />
              <Message
                v-if="$form.categoria?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.categoria.error?.message }}
              </Message>
            </div>
            <div class="flex flex-col gap-0.5">
              <label for="precio">Precio de venta <span class="text-red-500">*</span></label>
              <InputGroup>
                <InputGroupAddon class="h-9! text-sm! font-semibold">Bs.</InputGroupAddon>
                <InputNumber
                  name="precio"
                  inputId="precio"
                  mode="decimal"
                  locale="es-VE"
                  :minFractionDigits="2"
                  :maxFractionDigits="2"
                  autocomplete="off"
                  size="small"
                  fluid
                />
              </InputGroup>
              <Message
                v-if="$form.precio?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.precio.error?.message }}
              </Message>
            </div>
          </div>
          <div
            class="grid grid-cols-1 gap-x-6 gap-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 pb-5 shadow-xs ring-2 ring-white ring-inset sm:grid-cols-2 dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
          >
            <div class="flex items-center gap-2 sm:col-span-2">
              <i class="fi-sr-circle-2 text-xl text-emerald-500"></i>
              <span class="text-base! font-bold">Control de stock</span>
            </div>
            <div class="flex flex-col gap-1">
              <span>¿Controlar inventario? <span class="text-red-500">*</span></span>
              <SelectButton
                name="conteo"
                :options="conteoOpciones"
                optionLabel="label"
                optionValue="value"
                fluid
              />
              <Message
                v-if="$form.conteo?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.conteo.error?.message }}
              </Message>
            </div>
            <div class="flex flex-col gap-1">
              <label for="stock">Stock</label>
              <InputNumber
                name="stock"
                inputId="stock"
                :disabled="!$form.conteo?.value"
                showButtons
                buttonLayout="horizontal"
                :step="1"
                :min="0"
                :max="1000"
                autocomplete="off"
                size="small"
                fluid
              >
                <template #incrementbuttonicon>
                  <i class="fi-rr-plus" />
                </template>
                <template #decrementbuttonicon>
                  <i class="fi-rr-minus" />
                </template>
              </InputNumber>
              <Message
                v-if="$form.stock?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.stock.error?.message }}
              </Message>
            </div>
          </div>
        </div>
        <div class="flex h-16 shrink-0 items-center justify-end gap-3 border-t border-zinc-200 p-4 dark:border-zinc-700">
          <Button
            @click="closeCallback"
            label="Cancelar"
            type="button"
            size="small"
            severity="secondary"
          />
          <Button
            label="Guardar"
            type="submit"
            size="small"
          />
        </div>
      </Form>
    </template>
  </Drawer>
</template>
