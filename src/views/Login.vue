<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { UsuarioForm } from '@/types/usuarios.types';
import type { FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { loginSchema } from '@/schemas/login.schema';
import { useNotifications } from '@/composables/useNotifications';
import { useAuthStore } from '@/stores/auth.store';
import authService from '@/api/services/auth.service';

const { showError, showWarning } = useNotifications();
const usuario = ref<UsuarioForm>({
  username: '',
  password: '',
});

const cargando = ref<boolean>(false);
const router = useRouter();
const resolver = zodResolver(loginSchema);

const onSubmit = async (event: FormSubmitEvent) => {
  if (!event.valid) return;
  const authStore = useAuthStore();
  cargando.value = true;
  try {
    const respuesta = await authService.login(event.values);
    if (respuesta.success) {
      authStore.setData(respuesta.data);
      router.push('/mostrador');
    } else {
      showError('Credenciales incorrectas.');
    }
  } catch (error: any) {
    if (error.response?.status === 429) {
      showWarning(error.response.data.message);
    } else {
      showError('Error al validar las credenciales.');
    }
    console.error('Ocurrió un error al validar las credenciales: ', error);
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <div
    class="dark:text-zinc-150 flex h-full w-full max-w-108 flex-col justify-center gap-8 px-2 pb-8 text-zinc-700"
  >
    <div class="flex flex-col">
      <span class="text-xl font-bold text-zinc-700 dark:text-zinc-200">Iniciar sesión</span>
      <span class="text-sm text-zinc-400">Ingrese sus credenciales para continuar</span>
    </div>
    <Form
      v-slot="$form"
      :initialValues="usuario"
      :resolver="resolver"
      @submit="onSubmit"
    >
      <div class="grid grid-cols-1 gap-x-6 gap-y-4">
        <div class="flex flex-col gap-1">
          <label
            for="username"
            class="text-zinc-700 dark:text-zinc-200"
            >Nombre de usuario</label
          >
          <InputGroup>
            <InputGroupAddon>
              <i class="fi-rr-user"></i>
            </InputGroupAddon>
            <InputText
              name="username"
              id="username"
              size="small"
              fluid
              autocomplete="off"
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
          <span class="text-zinc-700 dark:text-zinc-200">Contraseña</span>
          <InputGroup>
            <InputGroupAddon>
              <i class="fi-rr-lock"></i>
            </InputGroupAddon>
            <Password
              name="password"
              toggleMask
              :feedback="false"
              size="small"
              fluid
            />
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
      </div>
      <div class="mt-8 flex flex-col gap-4">
        <Button
          label="Iniciar sesión"
          type="submit"
          class="h-9! w-full"
          :disabled="cargando"
        >
          <i
            class="fi-rr-loading animate-[spin_5s_linear_infinite] text-lg text-white!"
            v-if="cargando"
          ></i>
        </Button>
      </div>
    </Form>
  </div>
</template>
