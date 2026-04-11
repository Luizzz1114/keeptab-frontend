<script setup lang="ts">
import type { MenuGroup } from '@/types/ui.types';

defineProps<{ isCollapsed: boolean }>();
const emit = defineEmits(['toggle-sidebar']);

const menuGroups: MenuGroup[] = [
  {
    title: 'Principal',
    items: [
      { name: 'Mostrador', path: '/mostrador', icon: 'fi-sr-shopping-cart' },
      { name: 'Productos', path: '/productos', icon: 'fi-sr-box' },
      { name: 'Cuentas claras', path: '/cuentas', icon: 'fi-sr-users' },
    ],
  },
  {
    title: 'Gestión',
    items: [
      { name: 'Turnos y caja', path: '/turnos', icon: 'fi-sr-wallet' },
      { name: 'Usuarios', path: '/usuarios', icon: 'fi-sr-user' },
    ],
  },
];
</script>

<template>
  <div
    v-if="!isCollapsed"
    @click="emit('toggle-sidebar')"
    class="fixed inset-0 z-20 bg-zinc-900/30 backdrop-blur-sm transition-opacity md:hidden"
  ></div>
  <aside
    :class="isCollapsed ? '-translate-x-full md:w-0 md:translate-x-0' : 'w-62 translate-x-0'"
    class="fixed inset-y-0 left-0 z-30 h-full overflow-hidden bg-zinc-200 text-zinc-700 transition-all duration-300 ease-in-out md:relative dark:bg-zinc-950 dark:text-zinc-200"
  >
    <div class="flex h-full w-62 flex-col">
      <div class="mt-1.5 flex h-12 shrink-0 items-center gap-3 overflow-hidden px-4">
        <div class="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-500 p-1 text-xl text-white">
          <i class="fi-sr-receipt"></i>
        </div>
        <span class="text-lg font-extrabold whitespace-nowrap">KeepTab</span>
      </div>
      <nav class="flex flex-1 flex-col overflow-x-hidden overflow-y-auto p-4 text-sm">
        <div
          v-for="(group, index) in menuGroups"
          :key="group.title"
          class="flex flex-col"
        >
          <Divider
            v-if="index > 0"
            class="my-2! before:border-t! before:border-solid! before:border-zinc-300! dark:before:border-zinc-800!"
          />
          <span
            :class="index > 0 ? 'pt-2' : 'pt-0'"
            class="overflow-hidden p-2 font-semibold whitespace-nowrap text-zinc-500 dark:text-zinc-400"
          >
            {{ group.title }}
          </span>
          <ul class="flex flex-col gap-1 text-zinc-700 dark:text-zinc-200">
            <li
              v-for="item in group.items"
              :key="item.name"
              class="group flex items-center"
            >
              <router-link
                :to="item.path"
                class="group flex w-full items-center gap-3 rounded-xl p-1 ring ring-zinc-300/0 duration-250 ease-in-out hover:bg-zinc-100/50 hover:ring-zinc-300/40 dark:hover:bg-zinc-800/30 dark:hover:ring-zinc-700/35"
                active-class="active ring ring-zinc-300/100 bg-zinc-100 shadow-xs dark:ring-zinc-700/75 dark:bg-zinc-800/40"
              >
                <div class="grid size-7 shrink-0 place-items-center rounded-lg group-[.active]:bg-white group-[.active]:dark:bg-zinc-800">
                  <i
                    :class="item.icon"
                    class="text-[0.95rem] text-zinc-500 group-[.active]:text-emerald-500 dark:text-zinc-400"
                  ></i>
                </div>
                <span class="font-medium whitespace-nowrap group-[.active]:font-bold">
                  {{ item.name }}
                </span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </aside>
</template>
