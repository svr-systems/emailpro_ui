<template>
  <v-text-field
    :model-value="modelValue"
    :label="label"
    @update:model-value="emitValue"
    :type="isVisible ? 'text' : 'password'"
    :rules="rules"
    :counter="counter"
    :disabled="disabled"
    :prepend-inner-icon="prepend"
    variant="outlined"
    density="compact"
    maxlength="20"
    autocomplete="current-password"
  >
    <template #append-inner>
      <v-btn
        type="button"
        icon
        variant="plain"
        size="x-small"
        class="text-none"
        :aria-label="isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        @click.stop="toggleVisibility"
      >
        <v-icon>
          {{ isVisible ? "mdi-eye-off" : "mdi-eye" }}
        </v-icon>

        <v-tooltip activator="parent" location="top">
          {{ isVisible ? "Ocultar" : "Mostrar" }}
        </v-tooltip>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  label: { type: String, default: "Contraseña" },
  modelValue: { type: String, default: "" },
  rules: { type: Array, default: () => [] },
  counter: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  prepend: { type: String, default: null },
});

const emit = defineEmits(["update:modelValue"]);

const isVisible = ref(false);

const toggleVisibility = () => {
  isVisible.value = !isVisible.value;
};

const emitValue = (val) => {
  emit("update:modelValue", val);
};
</script>
