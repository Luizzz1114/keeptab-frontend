<script setup lang="ts">
const visible = defineModel<boolean>('visible');
const emit = defineEmits<{ (e: 'confirmLogout'): void }>();

const onConfirm = () => {
  emit('confirmLogout');
  visible.value = false;
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    class="w-11/12 max-w-md overflow-hidden rounded-2xl!"
  >
    <template #container="{ closeCallback }">
      <div class="relative flex items-center justify-between p-6 dark:border-zinc-700">
        <div class="flex w-full flex-col items-center justify-center gap-2">
          <div class="grid size-10 place-items-center rounded-xl border border-red-200 bg-red-100 text-lg dark:border-red-500/20 dark:bg-red-500/10">
            <i class="fi-sr-exit text-xl text-red-400"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-lg! font-bold dark:text-zinc-100">Cerrar sesión</span>
          </div>
        </div>
        <Button
          @click="closeCallback"
          icon="fi-br-cross"
          severity="secondary"
          class="absolute! top-6 right-6 size-8! *:text-xs!"
        />
      </div>

      <div class="flex flex-col overflow-hidden">
        <div class="flex flex-col gap-3 p-6 pt-0">
          <div
            class="flex flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-xs ring-2 ring-white ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
          >
            <span class="text-center text-base! font-bold">¿Está seguro de salir del sistema?</span>
            <span class="text-center text-sm text-zinc-500 dark:text-zinc-400"> Tendrá que volver a ingresar sus credenciales para acceder. </span>
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
            @click="onConfirm"
            label="Salir"
            type="button"
            size="small"
            severity="danger"
            class="min-w-18"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>
