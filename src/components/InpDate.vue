<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-y
    min-width="auto"
  >
    <template #activator="{ props: act }">
      <v-text-field
        v-bind="act"
        :label="label"
        :rules="rules"
        :disabled="disabled"
        :variant="outlined ? 'outlined' : 'filled'"
        density="compact"
        :clearable="clearable"
        readonly
        :model-value="displayValue"
        @click:clear="onClear"
      />
    </template>

    <v-row dense>
      <v-col cols="12">
        <v-date-picker
          v-model="pickerDate"
          hide-header
          landscape
          :min="dateMin"
          :max="dateMax"
          @update:model-value="onPick"
        />
      </v-col>
    </v-row>
  </v-menu>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: { type: [String, Date, null], default: null },
  label: { type: String, default: "" },
  rules: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
  outlined: { type: Boolean, default: true },
  clearable: { type: Boolean, default: false },
  before: { type: Boolean, default: false },
  after: { type: Boolean, default: false },
  min: { type: String, default: "" },
  max: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

const menu = ref(false);

// utils
const pad = (n) => String(n).padStart(2, "0");
const toYmd = (val) => {
  if (!val) return "";
  if (val instanceof Date) {
    if (isNaN(val)) return "";
    return `${val.getFullYear()}-${pad(val.getMonth() + 1)}-${pad(
      val.getDate()
    )}`;
  }
  if (typeof val === "string") {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val.trim());
    if (m) return val.trim();
    const d = new Date(val);
    if (isNaN(d)) return "";
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  return "";
};
const ymdToDateLocal = (ymd) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(ymd || ""));
  if (!m) return null;
  const [, y, mo, d] = m;
  return new Date(Number(y), Number(mo) - 1, Number(d));
};
const todayYmd = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// bounds
const dateMin = computed(() => {
  if (props.min) return props.min;
  if (props.after) return todayYmd();
  return "1920-01-01";
});
const dateMax = computed(() => {
  if (props.max) return props.max;
  if (props.before) return todayYmd();
  return "";
});

// binding
const pickerDate = ref(ymdToDateLocal(toYmd(props.modelValue)));
const displayValue = computed(() => toYmd(props.modelValue));

watch(
  () => props.modelValue,
  (v) => {
    pickerDate.value = ymdToDateLocal(toYmd(v));
  }
);
watch(menu, (open) => {
  if (open) pickerDate.value = ymdToDateLocal(toYmd(props.modelValue));
});

// Auto-aceptar al seleccionar fecha
const onPick = (val) => {
  const ymd = toYmd(val) || null;
  emit("update:modelValue", ymd);
  menu.value = false;
};

const onClear = () => {
  emit("update:modelValue", null);
  pickerDate.value = null;
  menu.value = false;
};
</script>
