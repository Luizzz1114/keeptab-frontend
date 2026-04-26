<script setup lang="ts">
import { getFormattedDate } from '@/utils/formatters';

defineProps<{ isDark: boolean }>();
const emit = defineEmits(['toggle-sidebar', 'toggle-dark-mode']);
</script>

<template>
  <header class="flex items-center justify-between p-2">
    <div class="flex items-center gap-1 rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-700 dark:bg-zinc-900">
      <div class="p-1">
        <Button
          @click="emit('toggle-sidebar')"
          type="button"
          icon="fi-rr-menu-burger"
          severity="secondary"
          class="size-8!"
        ></Button>
      </div>
      <Divider
        layout="vertical"
        class="m-0! self-stretch p-0! before:border-zinc-200! dark:before:border-zinc-700!"
      />
      <div class="p-1">
        <div class="flex items-center justify-center gap-2 px-2 text-sm text-zinc-600 dark:text-zinc-400">
          <i class="fi-sr-calendar-day text-sm! text-zinc-400"></i>
          {{ getFormattedDate() }}
        </div>
      </div>
    </div>
    <div class="flex items-center gap-1 rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-700 dark:bg-zinc-900">
      <div class="p-1">
        <Button
          @click="emit('toggle-dark-mode')"
          type="button"
          :icon="isDark ? 'fi-rr-moon' : 'fi-rr-sun'"
          severity="secondary"
          class="size-8!"
        ></Button>
      </div>
      <Divider
        layout="vertical"
        class="m-0! self-stretch p-0! before:border-zinc-200! dark:before:border-zinc-700!"
      />
      <div class="p-1">
        <Button
          icon="fi-sr-user"
          class="size-8!"
        ></Button>
      </div>
    </div>
  </header>
</template>
