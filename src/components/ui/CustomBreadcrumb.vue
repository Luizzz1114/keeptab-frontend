<script setup lang="ts">
interface BreadcrumbItem {
  label: string;
  icon?: string;
  route?: string;
}

interface Props {
  items?: BreadcrumbItem[];
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
});

const home: BreadcrumbItem = {
  icon: 'fi-sr-shopping-cart',
  label: 'Mostrador',
  route: '/mostrador',
};
</script>

<template>
  <Breadcrumb
    :home="home"
    :model="items"
    class="shrink-0 text-xs!"
  >
    <template #item="{ item }">
      <router-link
        v-if="item.route"
        :to="item.route"
        class="flex items-center gap-2 text-zinc-400 duration-200 ease-in-out hover:text-zinc-500 dark:hover:text-zinc-300"
      >
        <i :class="[item.icon, 'text-color']"></i>
        <span class="font-normal!">{{ item.label }}</span>
      </router-link>
    </template>
    <template #separator>
      <i class="fi-rr-angle-small-right"></i>
    </template>
  </Breadcrumb>
</template>
