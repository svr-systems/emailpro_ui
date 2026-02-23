<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-y
    min-width="auto"
  >
    <!-- Activador -->
    <template #activator="{ props: act }">
      <v-text-field
        v-bind="act"
        :label="label"
        :rules="rules"
        :disabled="disabled"
        :variant="outlined ? 'outlined' : 'filled'"
        density="compact"
        readonly
        :model-value="normalizedTime"
      />
    </template>

    <v-time-picker
      v-model="timeValue"
      :min="timeMin"
      :max="timeMax"
      :format="format24 ? '24hr' : 'ampm'"
      :use-seconds="seconds"
      color="warning"
      @update:model-value="menu = false"
    />
  </v-menu>
</template>

<script setup>
import { ref, computed } from "vue";

/**
 * Props:
 * - v-model (modelValue): String 'HH:mm' | 'HH:mm:ss' | Date | null
 * - seconds: incluir segundos (formato 'HH:mm:ss')
 * - min, max: límites en el MISMO formato que uses (con o sin segundos)
 * - format24: usa reloj 24h o am/pm (solo visual)
 */
const props = defineProps({
  modelValue: { type: [String, Date, null], default: null },
  label: { type: String, default: "" },
  rules: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
  outlined: { type: Boolean, default: true },
  seconds: { type: Boolean, default: false },
  format24: { type: Boolean, default: true },
  min: { type: String, default: "" }, // 'HH:mm' o 'HH:mm:ss'
  max: { type: String, default: "" }, // 'HH:mm' o 'HH:mm:ss'
});

const emit = defineEmits(["update:modelValue"]);
const menu = ref(false);

/* ---------- utils ---------- */
const pad = (n) => String(n).padStart(2, "0");

const toTimeString = (val, withSeconds) => {
  // Devuelve string normalizado o '' si invalida
  if (!val) return "";
  if (val instanceof Date) {
    if (isNaN(val)) return "";
    const hh = pad(val.getHours());
    const mm = pad(val.getMinutes());
    const ss = pad(val.getSeconds());
    return withSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
  }
  const s = String(val).trim();

  if (withSeconds) {
    // HH:mm:ss
    const m = /^(\d{2}):(\d{2}):(\d{2})$/.exec(s);
    if (m) return s;
    // fallback: intentar parsear HH:mm o Date-like
    const m2 = /^(\d{2}):(\d{2})$/.exec(s);
    if (m2) return `${m2[1]}:${m2[2]}:00`;
    const d = new Date(s);
    if (!isNaN(d)) return toTimeString(d, true);
    return "";
  } else {
    // HH:mm
    const m = /^(\d{2}):(\d{2})$/.exec(s);
    if (m) return s;
    // fallback: intentar parsear HH:mm:ss o Date-like
    const m2 = /^(\d{2}):(\d{2}):(\d{2})$/.exec(s);
    if (m2) return `${m2[1]}:${m2[2]}`;
    const d = new Date(s);
    if (!isNaN(d)) return toTimeString(d, false);
    return "";
  }
};

// Valor por defecto para anclar el picker si no hay modelo (no se emite)
const defaultTime = computed(() => (props.seconds ? "12:00:00" : "12:00"));

/* ---------- binding externo/interno ---------- */
// Lo que se muestra en el input (normalizado)
const normalizedTime = computed(() =>
  toTimeString(props.modelValue, props.seconds)
);

// v-time-picker usa string; si no hay valor, anclamos al default
const timeValue = computed({
  get: () => normalizedTime.value || defaultTime.value,
  set: (val) => {
    const t = toTimeString(val, props.seconds) || null;
    emit("update:modelValue", t);
  },
});

/* ---------- límites ---------- */
const timeMin = computed(() => props.min || undefined);
const timeMax = computed(() => props.max || undefined);
</script>
