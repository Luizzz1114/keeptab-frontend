<script setup lang="ts">
import { computed, ref } from 'vue';
import type { UsuarioForm } from '@/types/usuarios.types';
import type { FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { getUsuarioSchema, roles } from '@/schemas/usuarios.schema';
import usuariosService from '@/api/services/usuarios.service';

const visible = defineModel<boolean>('visible');
const emit = defineEmits<{ (e: 'confirmEdit', payload: UsuarioForm): void }>();
const props = defineProps<{ usuario: UsuarioForm | null }>();

const initialValues = computed(() => {
  return {
    ...props.usuario,
  };
});

const isCheckingUsername = ref(false);
const confirmEdit = new Map<string, boolean>();
let debounceTimer: ReturnType<typeof setTimeout>;

const checkUsernameAvailability = (username: string): Promise<boolean> => {
  if (!username || props.usuario?.username === username) {
    return Promise.resolve(true);
  }
  if (confirmEdit.has(username)) {
    return Promise.resolve(confirmEdit.get(username)!);
  }
  isCheckingUsername.value = true;
  return new Promise((resolve) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const response = await usuariosService.search(username);
        const disponible = response.data.length === 0;
        confirmEdit.set(username, disponible); 
        resolve(disponible);
      } catch (error) {
        resolve(false); 
      } finally {
        isCheckingUsername.value = false;
      }
    }, 500);
  });
};

const usuarioSchema = getUsuarioSchema(true, checkUsernameAvailability);
const resolver = zodResolver(usuarioSchema);

const onSubmit = (event: FormSubmitEvent) => {
  if (!event.valid) return;
  const data = event.values as UsuarioForm;
  const payload: UsuarioForm = {
    ...data,
    id: props.usuario?.id,
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
            <i class="fi-sr-user"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-lg! font-bold dark:text-zinc-200">Editar usuario</span>
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
        :key="usuario?.id"
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
              <label for="username">Nombre de usuario <span class="text-red-500">*</span></label>
              <InputGroup>
                <InputGroupAddon>
                  <i v-if="isCheckingUsername" class="fi-rr-spinner animate-spin text-emerald-500"></i>
                  <i v-else class="fi-rr-user"></i>
                </InputGroupAddon>
                <InputText
                  name="username"
                  id="username"
                  maxlength="50"
                  autocomplete="off"
                  size="small"
                  fluid
                />
              </InputGroup>
              <Message
                v-if="$form.username?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.username.error?.message }}
              </Message>
            </div>
            <div class="flex flex-col gap-1">
              <span>Rol <span class="text-red-500">*</span></span>
              <InputGroup>
                <InputGroupAddon>
                  <i class="fi-rr-shield"></i>
                </InputGroupAddon>
                <Select
                  name="rol"
                  :options="roles"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Seleccione"
                  size="small"
                  fluid
                />
              </InputGroup>
              <Message
                v-if="$form.rol?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.rol.error?.message }}
              </Message>
            </div>
          </div>
          <div
            class="grid grid-cols-1 gap-x-6 gap-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 pb-5 shadow-xs ring-2 ring-white ring-inset sm:grid-cols-2 dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
          >
            <div class="flex items-center gap-2 sm:col-span-2">
              <i class="fi-sr-circle-2 text-xl text-emerald-500"></i>
              <span class="text-base! font-bold">Cambiar contraseña</span>
            </div>
            <div class="flex flex-col gap-1">
              <span>Contraseña</span>
              <InputGroup>
                <InputGroupAddon>
                  <i class="fi-rr-lock"></i>
                </InputGroupAddon>
                <Password
                  name="password"
                  size="small"
                  fluid
                  toggleMask
                >
                  <template #header>
                    <div class="mb-3 font-semibold">Requisitos de seguridad</div>
                  </template>
                  <template #footer>
                    <Divider />
                    <ul class="pl-2 text-sm leading-normal">
                      <li>Al menos una minúscula</li>
                      <li>Al menos una mayúscula</li>
                      <li>Al menos un número</li>
                      <li>Mínimo 8 caracteres</li>
                    </ul>
                  </template>
                </Password>
              </InputGroup>
              <Message
                v-if="$form.password?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.password.error?.message }}
              </Message>
            </div>
            <div class="flex flex-col gap-1">
              <span>Confirmar contraseña</span>
              <InputGroup>
                <InputGroupAddon><i class="fi-rr-lock"></i></InputGroupAddon>
                <Password
                  name="confirmPassword"
                  toggleMask
                  :feedback="false"
                  size="small"
                  fluid
                />
              </InputGroup>
              <Message
                v-if="$form.confirmPassword?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.confirmPassword.error?.message }}
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
