<script setup lang="ts">
const visible = defineModel<boolean>('visible');
const emit = defineEmits(['confirmCreate']);
</script>

<template>
  <Dialog v-model:visible="visible" modal class="w-11/12 max-w-102 overflow-hidden rounded-2xl!">
    <template #container>
      <div class="relative flex flex-col items-center justify-between p-6 dark:border-zinc-700">
        <div class="flex w-full flex-col items-center justify-center gap-2">
          <div class="grid size-10 place-items-center rounded-xl border border-red-200 bg-red-100 text-lg dark:border-red-500/20 dark:bg-red-500/10">
            <i class="fi-sr-calendar-arrow-up text-xl! text-red-400!"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-lg! font-bold dark:text-zinc-100">No hay jornada activa</span>
          </div>
        </div>
        <div
          class="dark:bg-zinc-800/50rounded-2xl mt-4 flex w-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-center leading-tight shadow-xs ring-2 ring-white ring-inset sm:grid-cols-2 dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
        >
          <p>Para comenzar a vender y atender en el mostrador, es necesario que inicies una nueva jornada de trabajo</p>
        </div>
      </div>
      <div class="flex w-full items-center justify-center p-6 pt-0">
        <Button as="router-link" to="/jornadas" label="Ir a abrir jornada" severity="danger" type="submit" size="small" class="min-w-18" />
      </div>
    </template>
  </Dialog>
</template>
