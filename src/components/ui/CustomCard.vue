<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  subtitle: { type: String, required: true },
  icon: { type: String, default: 'fi-rr-box' },
  variant: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'success'].includes(value),
  },
});
</script>

<template>
  <div
    class="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 shadow-xs ring-2 ring-white ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
  >
    <div class="flex items-center gap-3">
      <div
        :class="
          variant === 'success'
            ? 'bg-emerald-100 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400'
            : 'bg-zinc-200/75 text-zinc-500 dark:bg-zinc-500/10 dark:text-zinc-300'
        "
        class="grid size-8 place-items-center rounded-lg text-lg ring ring-current/20 ring-inset"
      >
        <i
          :class="icon"
          class="text-sm"
        ></i>
      </div>
      <span
        :class="[
          'text-sm font-bold',
          variant === 'success'
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-zinc-600 dark:text-zinc-300',
        ]"
      >
        {{ title }}
      </span>
    </div>

    <span
      :class="[
        'text-xl font-bold',
        variant === 'success'
          ? 'text-emerald-500 dark:text-emerald-400'
          : 'text-zinc-600 dark:text-zinc-300',
      ]"
    >
      {{ value }}
    </span>

    <p class="text-xs! text-zinc-500 dark:text-zinc-400">
      {{ subtitle }}
    </p>
  </div>
</template>
