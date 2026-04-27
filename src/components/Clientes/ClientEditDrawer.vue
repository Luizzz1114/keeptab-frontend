<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Cliente } from '@/types/clientes.types';
import type { FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { getClienteSchema } from '@/schemas/clientes.schema';
import clientesService from '@/api/services/clientes.service';

const visible = defineModel<boolean>('visible');
const emit = defineEmits<{ (e: 'confirmEdit', payload: Cliente): void }>();
const props = defineProps<{ cliente: Cliente | null }>();

const initialValues = computed(() => {
  return {
    ...props.cliente,
  };
});

const isCheckingCedula = ref(false);
const validationCache = new Map<string, boolean>();
let debounceTimer: ReturnType<typeof setTimeout>;

const checkCedula = (cedula: string): Promise<boolean> => {
  if (!cedula || props.cliente?.cedula === cedula) {
    return Promise.resolve(true);
  }
  if (validationCache.has(cedula)) {
    return Promise.resolve(validationCache.get(cedula)!);
  }
  isCheckingCedula.value = true;
  return new Promise((resolve) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const response = await clientesService.search(cedula);
        const disponible = response.data.length === 0;
        validationCache.set(cedula, disponible);
        resolve(disponible);
      } catch (error) {
        resolve(false);
      } finally {
        isCheckingCedula.value = false;
      }
    }, 500);
  });
};

const clienteSchema = getClienteSchema(checkCedula);
const resolver = ref(zodResolver(clienteSchema));

const onSubmit = (event: FormSubmitEvent) => {
  if (!event.valid) return;
  const data = event.values as Cliente;
  const payload: Cliente = {
    ...data,
    id: props.cliente?.id,
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
      <div
        class="flex h-16 items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-700"
      >
        <div class="flex items-center gap-3">
          <div class="grid size-9 place-items-center rounded-lg bg-emerald-500 text-lg text-white">
            <i class="fi-sr-users"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-lg! font-bold dark:text-zinc-200">Editar cliente</span>
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
        :key="cliente?.id"
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
              <label for="nombre">Nombre del cliente <span class="text-red-500">*</span></label>
              <InputText
                name="nombre"
                id="nombre"
                maxlength="50"
                autocomplete="off"
                size="small"
                fluid
              />
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
              <label for="cedula">Cédula <span class="text-red-500">*</span></label>
              <IconField>
                <InputText
                  name="cedula"
                  id="cedula"
                  v-keyfilter.int
                  maxlength="8"
                  autocomplete="off"
                  size="small"
                  fluid
                />
                <InputIcon>
                  <i
                    v-if="isCheckingCedula"
                    class="fi-rr-spinner animate-spin text-emerald-500"
                  ></i>
                </InputIcon>
              </IconField>
              <Message
                v-if="$form.cedula?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.cedula.error?.message }}
              </Message>
            </div>
            <div class="flex flex-col gap-1">
              <label for="contacto">Contacto</label>
              <InputMask
                name="contacto"
                id="contacto"
                mask="9999-9999999"
                autocomplete="off"
                size="small"
                fluid
              />
              <Message
                v-if="$form.contacto?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.contacto.error?.message }}
              </Message>
            </div>
          </div>
        </div>
        <div
          class="flex h-16 shrink-0 items-center justify-end gap-3 border-t border-zinc-200 p-4 dark:border-zinc-700"
        >
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
