<template>
  <v-select
    :label="label"
    :items="years"
    v-model="yearValue"
    :rules="rules"
    :disabled="disabled"
    :variant="outlined ? 'outlined' : 'filled'"
    density="compact"
    :clearable="clearable"
    :menu-props="{ maxHeight: 300 }"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: [String, Number, null], default: null },
  label: { type: String, default: "" },
  rules: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
  outlined: { type: Boolean, default: true },
  clearable: { type: Boolean, default: false },
  minYear: { type: [String, Number], default: 1920 },
  maxYear: { type: [String, Number], default: "" },
});

const emit = defineEmits(["update:modelValue"]);

const currentYear = new Date().getFullYear();
const toYearNum = (v) => {
  if (!v) return null;
  const n = Number(String(v).slice(0, 4));
  return Number.isFinite(n) ? n : null;
};

// límites
const yMin = computed(() => toYearNum(props.minYear) ?? 1920);
const yMax = computed(() => toYearNum(props.maxYear) ?? currentYear);

// lista de años (descendente)
const years = computed(() => {
  const arr = [];
  for (let y = yMin.value; y <= yMax.value; y++) arr.push(String(y));
  return arr.reverse();
});

// binding directo entre select y v-model externo
const yearValue = computed({
  get: () => {
    const y = toYearNum(props.modelValue);
    return y ? String(y) : null;
  },
  set: (val) => {
    const y = toYearNum(val);
    emit("update:modelValue", y ? String(y) : null);
  },
});
</script>
