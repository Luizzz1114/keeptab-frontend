<script setup lang="ts">
import { ref, watch } from 'vue';
import Header from '@/components/ui/Header.vue';
import Sidebar from '@/components/ui/Sidebar.vue';

// --- Estado del Sidebar ---
const savedState = localStorage.getItem('sidebarCollapsed');
const isSidebarCollapsed = ref<boolean>(savedState === 'true');

watch(isSidebarCollapsed, (newValue: boolean) => {
  localStorage.setItem('sidebarCollapsed', String(newValue));
});

const handleToggleSidebar = (): void => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const closeSidebar = (): void => {
  isSidebarCollapsed.value = true;
};

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
    :class="{ 'gap-1.5': !isSidebarCollapsed }"
    class="flex h-dvh w-dvw overflow-hidden bg-zinc-200 transition-all duration-300 md:p-1.5 dark:bg-zinc-950"
  >
    <Sidebar
      :is-collapsed="isSidebarCollapsed"
      @toggle-sidebar="closeSidebar"
    />
    <div class="flex w-full flex-1 flex-col overflow-hidden border-zinc-300 bg-white shadow-xs md:rounded-2xl md:border dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-zinc-400/10">
      <Header
        :is-dark="isDark"
        :is-collapsed="isSidebarCollapsed"
        @toggle-dark-mode="handleToggleDarkMode"
        @toggle-sidebar="handleToggleSidebar"
      />
      <main class="flex flex-1 flex-col overflow-y-auto p-4 pt-2 text-zinc-700 dark:text-zinc-200">
        <router-view />
      </main>
    </div>
  </div>
</template>
