<script setup lang="ts">
import TableGrid from '@/components/TableGrid.vue';
import Breadcrumb from '@/components/CustomBreadcrumb.vue';

const items = [{ label: 'Productos', route: '/productos' }];
</script>

<template>
  <div class="flex flex-col">
    <Breadcrumb :items="items" />
    <div class="mt-3 mb-4 flex justify-between">
      <div class="flex items-center gap-3">
        <div class="grid size-8 place-items-center rounded-lg bg-emerald-500 text-white">
          <i class="fi-br-box"></i>
        </div>
        <h2 class="text-lg font-extrabold dark:text-zinc-200">Productos</h2>
      </div>
      <Button
        label="Nuevo producto"
        icon="fi-br-plus-small"
        severity="contrast"
        class="flex! h-8! items-center!"
        size="small"
      />
    </div>
    <TableGrid />
  </div>
</template>
