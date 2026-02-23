<template>
  <div v-if="value" class="d-inline-flex align-center ga-1">
    <v-btn icon variant="text" size="x-small" @click.prevent="docPreview">
      <v-icon>mdi-file-eye</v-icon>
      <v-tooltip activator="parent" location="right">Vista previa</v-tooltip>
    </v-btn>

    <v-btn
      icon
      variant="text"
      size="x-small"
      @click.prevent="docDwd"
      :disabled="disabled"
    >
      <v-icon>mdi-download</v-icon>
      <v-tooltip activator="parent" location="right">Descargar</v-tooltip>
    </v-btn>
  </div>

  <v-tooltip v-else location="right">
    <template #activator="{ props: activatorProps }">
      <v-icon v-bind="activatorProps" size="small">mdi-alert</v-icon>
    </template>
    <span>Pendiente</span>
  </v-tooltip>
</template>

<script setup>
// Importaciones
import { ref, onMounted } from "vue";
import { getBlob } from "@/utils/coders";
import { getDateTime } from "@/utils/formatters";

// Props
const props = defineProps({
  value: Object,
  disabled: {
    type: Boolean,
    default: false,
  },
});

// Estado
const docUrl = ref(null);

// Métodos
const docPreview = () => {
  window.open(docUrl.value, "_blank");
};

const docDwd = () => {
  const link = document.createElement("a");
  link.href = docUrl.value;
  link.setAttribute("target", "_blank");
  link.download = `doc_${getDateTime("", "", "")}.${props.value?.ext || "bin"}`;
  link.click();
};

// Inicialización
onMounted(() => {
  const { value } = props;
  if (value?.cnt && value?.ext) {
    try {
      docUrl.value = URL.createObjectURL(getBlob(value.cnt, value.ext));
    } catch (error) {
      console.error("Error al crear el blob del documento:", error);
      docUrl.value = null;
    }
  }
});
</script>
