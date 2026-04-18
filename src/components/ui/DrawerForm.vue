<script setup lang="ts">
import { ref, watch } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { ZodSchema } from 'zod';

export interface DrawerField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'mask' | 'currency';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { label: string; value: any }[];
  mask?: string;
  min?: number;
  max?: number;
  maxlength?: number;
  rows?: number;
  iconLoading?: boolean;
  colSpan?: number;
  currencyConfig?: {
    locale: string;
    minFractionDigits: number;
    maxFractionDigits: number;
    prefix: string;
  };
}

export interface DrawerSection {
  title: string;
  icon?: string;
  fields: DrawerField[];
}

export interface DrawerFormProps {
  visible: boolean;
  title: string;
  icon?: string;
  initialValues?: Record<string, any>;
  schema: ZodSchema;
  sections: DrawerSection[];
  confirmLabel?: string;
}

const props = withDefaults(defineProps<DrawerFormProps>(), {
  confirmLabel: 'Guardar',
});

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'confirm', data: Record<string, any>): void;
}>();

const formData = ref<Record<string, any>>({});
const resolver = ref(zodResolver(props.schema));

// Reset form when visibility changes to true
watch(() => props.visible, (newVal) => {
  if (newVal) {
    formData.value = { ...props.initialValues };
  }
});

// Initialize form data
if (props.initialValues) {
  formData.value = { ...props.initialValues };
}

const onSubmit = (event: any) => {
  if (!event.valid) return;
  emit('confirm', event.values);
  emit('update:visible', false);
};

const getFieldValue = (field: DrawerField): any => {
  return formData.value[field.name];
};

const updateFieldValue = (field: DrawerField, value: any) => {
  formData.value[field.name] = value;
};

// Helper to get grid class based on colSpan
const getColSpanClass = (colSpan?: number): string => {
  if (!colSpan || colSpan === 1) return '';
  if (colSpan === 2) return 'sm:col-span-2';
  return `sm:col-span-${colSpan}`;
};
</script>

<template>
  <Drawer
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    position="right"
    :dismissable="false"
    class="m-2! h-[calc(100dvh-1rem)]! w-[calc(100%-1rem)]! overflow-hidden rounded-2xl! border! md:w-180!"
  >
    <template #container="{ closeCallback }">
      <div class="flex h-16 items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-700">
        <div class="flex items-center gap-3">
          <div class="grid size-9 place-items-center rounded-lg bg-emerald-500 text-lg text-white">
            <i :class="icon || 'fi-sr-box'"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-lg! font-bold dark:text-zinc-200">{{ title }}</span>
          </div>
        </div>
        <Button
          @click="closeCallback"
          icon="fi-br-cross"
          severity="secondary"
          class="size-8! *:text-xs!"
        />
      </div>
      
      <Form
        v-slot="$form"
        :resolver="resolver"
        :initialValues="formData"
        @submit="onSubmit"
        class="flex h-full flex-col overflow-hidden"
      >
        <div class="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
          <div
            v-for="(section, sectionIndex) in sections"
            :key="sectionIndex"
            class="grid grid-cols-1 gap-x-6 gap-y-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 pb-5 shadow-xs ring-2 ring-white ring-inset sm:grid-cols-2 dark:border-zinc-700 dark:bg-zinc-800/65 dark:ring-zinc-900/65"
          >
            <div class="flex items-center gap-2 sm:col-span-2">
              <i v-if="section.icon" :class="section.icon + ' text-xl text-emerald-500'"></i>
              <span class="text-base! font-bold">{{ section.title }}</span>
            </div>
            
            <div
              v-for="field in section.fields"
              :key="field.name"
              class="flex flex-col gap-1"
              :class="getColSpanClass(field.colSpan)"
            >
              <label :for="field.name">
                {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>
              
              <!-- Input Text -->
              <InputText
                v-if="field.type === 'text'"
                :name="field.name"
                :id="field.name"
                :placeholder="field.placeholder"
                :maxlength="field.maxlength"
                :disabled="field.disabled"
                autocomplete="off"
                size="small"
                fluid
              />
              
              <!-- Input Number -->
              <InputNumber
                v-else-if="field.type === 'number'"
                :name="field.name"
                :id="field.name"
                :disabled="field.disabled"
                autocomplete="off"
                size="small"
                fluid
              />
              
              <!-- Input Currency -->
              <InputGroup v-else-if="field.type === 'currency'">
                <InputGroupAddon class="h-9! text-sm! font-semibold">
                  {{ field.currencyConfig?.prefix || 'Bs.' }}
                </InputGroupAddon>
                <InputNumber
                  :name="field.name"
                  :id="field.name"
                  mode="decimal"
                  :locale="field.currencyConfig?.locale || 'es-VE'"
                  :minFractionDigits="field.currencyConfig?.minFractionDigits || 2"
                  :maxFractionDigits="field.currencyConfig?.maxFractionDigits || 2"
                  autocomplete="off"
                  size="small"
                  fluid
                />
              </InputGroup>
              
              <!-- Select -->
              <Select
                v-else-if="field.type === 'select'"
                :name="field.name"
                :options="field.options"
                optionLabel="label"
                optionValue="value"
                :placeholder="field.placeholder || 'Seleccione'"
                :disabled="field.disabled"
                size="small"
                fluid
              />
              
              <!-- Input Mask -->
              <InputMask
                v-else-if="field.type === 'mask'"
                :name="field.name"
                :id="field.name"
                :mask="field.mask"
                :placeholder="field.placeholder"
                autocomplete="off"
                size="small"
                fluid
              />
              
              <!-- Textarea -->
              <Textarea
                v-else-if="field.type === 'textarea'"
                :name="field.name"
                :id="field.name"
                :placeholder="field.placeholder"
                :rows="field.rows || 3"
                :disabled="field.disabled"
                autocomplete="off"
                size="small"
                fluid
              />
              
              <!-- Validation Message -->
              <Message
                v-if="$form[field.name]?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form[field.name]?.error?.message }}
              </Message>
            </div>
          </div>
        </div>
        
        <div class="flex h-16 shrink-0 items-center justify-end gap-3 border-t border-zinc-200 p-4 dark:border-zinc-700">
          <Button
            @click="closeCallback"
            label="Cancelar"
            type="button"
            size="small"
            severity="secondary"
          />
          <Button
            :label="confirmLabel"
            type="submit"
            size="small"
          />
        </div>
      </Form>
    </template>
  </Drawer>
</template>