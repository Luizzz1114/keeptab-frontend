<script setup lang="ts">
import { ref } from 'vue';
import type { Jornada } from '@/types/jornadas.types';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { updateJornadaSchema } from '@/schemas/jornadas.schema';

const visible = defineModel<boolean>('visible');
const emit = defineEmits<{ (e: 'confirmEdit', payload: Jornada): void }>();
const props = defineProps<{ jornadaId: Jornada['id'] | null | undefined }>();

const jornada = ref<Jornada>({
  total_fisico: 0.0,
});

const resolver = zodResolver(updateJornadaSchema);

const onSubmit = (event: any) => {
  if (!event.valid) return;
  const payload: Jornada = {
    id: props.jornadaId,
    ...event.values,
  };
  emit('confirmEdit', payload);
  visible.value = false;
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    class="w-11/12 max-w-md overflow-hidden rounded-2xl!"
  >
    <template #container="{ closeCallback }">
      <div class="relative flex items-center justify-between p-6 dark:border-zinc-700">
        <div class="flex w-full flex-col items-center justify-center gap-2">
          <div class="grid size-10 place-items-center rounded-xl border border-emerald-200 bg-emerald-100 text-lg dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <i class="fi-sr-calendar-arrow-down text-xl text-emerald-500"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-lg! font-bold dark:text-zinc-100">Cerrar jornada</span>
          </div>
        </div>
        <Button
          @click="closeCallback"
          icon="fi-br-cross"
          severity="secondary"
          class="absolute! top-6 right-6 size-8! *:text-xs!"
        />
      </div>
      <Form
        v-slot="$form"
        :resolver="resolver"
        :initialValues="jornada"
        @submit="onSubmit"
        class="flex h-full flex-col overflow-hidden"
      >
        <div class="flex flex-1 flex-col gap-3 overflow-y-auto p-6 pt-0">
          <div
            class="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 pb-5 shadow-xs ring-2 ring-white ring-inset dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
          >
            <span class="text-center text-base! font-bold">Dinero Contado Físicamente</span>
            <div class="flex flex-col gap-0.5">
              <label for="total_fisico">Total físico <span class="text-red-500">*</span></label>
              <InputGroup>
                <InputGroupAddon class="h-9! text-sm! font-semibold">Bs.</InputGroupAddon>
                <InputNumber
                  name="total_fisico"
                  inputId="total_fisico"
                  mode="decimal"
                  locale="es-VE"
                  :minFractionDigits="2"
                  :maxFractionDigits="2"
                  autocomplete="off"
                  size="small"
                  fluid
                />
              </InputGroup>
              <Message
                v-if="$form.total_fisico?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.total_fisico.error?.message }}
              </Message>
            </div>
          </div>
        </div>
        <div class="flex w-full items-center justify-center gap-3 p-6 pt-0">
          <Button
            @click="closeCallback"
            label="Cancelar"
            type="button"
            size="small"
            severity="secondary"
            class="min-w-20"
          />
          <Button
            label="Cerrar"
            type="submit"
            size="small"
            class="min-w-18"
          />
        </div>
      </Form>
    </template>
  </Dialog>
</template>
