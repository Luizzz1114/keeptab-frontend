<script setup lang="ts">
import { ref, watch } from 'vue';

// --- Estado del Modo Oscuro ---
const savedTheme = localStorage.getItem('theme');
const isDark = ref<boolean>(savedTheme === 'dark');

const handleToggleDarkMode = (): void => {
  isDark.value = !isDark.value;
};

watch(
  isDark,
  (isNowDark) => {
    if (isNowDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  },
  { immediate: true },
);
</script>

<template>
  <div
    class="flex h-dvh w-dvw justify-end overflow-hidden bg-zinc-200 bg-linear-to-b p-1.5 dark:bg-zinc-950"
  >
    <div class="flex flex-1 flex-col items-center justify-center sm:p-4"></div>
    <div
      class="flex h-full w-full flex-col items-center rounded-2xl border border-zinc-300 bg-white p-6 shadow-xs sm:w-100 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div class="flex w-full items-center justify-between">
        <div class="flex shrink-0 items-center gap-3 overflow-hidden">
          <div
            class="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-500 p-1 text-xl text-white"
          >
            <i class="fi-sr-receipt"></i>
          </div>
          <span class="text-lg font-extrabold whitespace-nowrap text-zinc-700 dark:text-zinc-200"
            >KeepTab</span
          >
        </div>
        <Button
          @click="handleToggleDarkMode"
          type="button"
          :icon="isDark ? 'fi-rr-moon' : 'fi-rr-sun'"
          severity="secondary"
          class="size-8! shrink-0!"
        ></Button>
      </div>

      <router-view></router-view>
    </div>
  </div>
</template>
