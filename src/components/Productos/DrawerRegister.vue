<script setup lang="ts">
defineProps<{ visible: boolean }>();
defineEmits(['update:visible']);
</script>

<template>
  <Drawer
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    position="right"
    :dismissable="false"
    class="m-2! h-[calc(100dvh-1rem)]! w-[calc(100%-1rem)]! overflow-hidden rounded-2xl! border! md:w-180!"
  >
    <template #container="{ closeCallback }">
      <div class="flex h-16 items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-700">
        <div class="flex items-center gap-3">
          <div class="grid size-9 place-items-center rounded-lg bg-emerald-500 text-lg text-white">
            <i class="fi-sr-box"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-lg! font-bold dark:text-zinc-200">Registrar producto</span>
          </div>
        </div>
        <Button
          @click="closeCallback"
          icon="fi-br-cross"
          severity="secondary"
          class="size-8! *:text-xs!"
        />
      </div>
    </template>
  </Drawer>
</template>
