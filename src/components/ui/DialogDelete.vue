<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm';

const props = withDefaults(defineProps<{ label?: string }>(), {
  label: 'registro',
});

const emit = defineEmits<{
  (e: 'confirmDelete', id: number): void;
}>();

const confirm = useConfirm();

const openConfirm = (item: any, details: string) => {
  confirm.require({
    group: 'headless',
    message: details,
    header: `Eliminar ${props.label}`,
    accept: () => {
      emit('confirmDelete', item.id);
    },
  });
};

defineExpose({ openConfirm });
</script>

<template>
  <ConfirmDialog
    group="headless"
    class="w-11/12 max-w-md overflow-hidden rounded-2xl!"
  >
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="bg-zinc-0 dark:bg-zinc-850 relative flex flex-col items-center p-6">
        <Button
          @click="rejectCallback"
          icon="fi-br-cross"
          severity="secondary"
          class="absolute! top-6 right-6 size-8! *:text-xs!"
        />
        <div
          class="grid size-10 place-items-center rounded-xl border border-red-200 bg-red-100 text-lg dark:border-red-500/20 dark:bg-red-500/10"
        >
          <i class="fi-rr-hexagon-exclamation text-xl! text-red-400!"></i>
        </div>
        <span class="mt-2 text-xl! font-bold">{{ message.header }}</span>
        <p class="mt-1 text-center">¿Está seguro de eliminar este registro?</p>
        <div
          class="dark:bg-zinc-800/50rounded-2xl mt-4 flex w-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 shadow-xs ring-2 ring-white ring-inset sm:grid-cols-2 dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
        >
          <div
            v-for="(val, label, index) in message.message"
            :key="label"
            class="flex items-center justify-between gap-4 px-3 py-2 text-sm"
            :class="{
              'border-b border-zinc-200 dark:border-zinc-700':
                index !== Object.keys(message.message).length - 1,
            }"
          >
            <span class="font-medium whitespace-nowrap text-zinc-500 dark:text-zinc-400">
              {{ label }}
            </span>
            <span
              class="max-w-[60%] truncate text-right font-semibold text-zinc-800 dark:text-zinc-200"
            >
              {{ val }}
            </span>
          </div>
        </div>
        <div class="mt-6 flex items-center gap-3">
          <Button
            @click="rejectCallback"
            label="Cancelar"
            severity="secondary"
            variant="outlined"
          />
          <Button
            @click="acceptCallback"
            label="Eliminar"
            severity="danger"
          />
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>
