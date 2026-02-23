<template>
  <v-btn
    v-if="value?.cnt && value?.ext && docUrl"
    icon
    variant="text"
    size="small"
    @click.prevent="docDwd"
  >
    <v-icon>mdi-download</v-icon>
    <v-tooltip activator="parent" location="bottom">Descargar</v-tooltip>
  </v-btn>
</template>

<script setup>
// Importaciones de librerías
import { ref, onMounted } from "vue";
import { getBlob } from "@/utils/coders";
import { getDateTime } from "@/utils/formatters";

// Props
const props = defineProps({
  value: {
    type: Object,
    default: null,
  },
});

// Estado reactivo
const docUrl = ref(null);

// Descargar documento
const docDwd = () => {
  const link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.href = docUrl.value;
  link.download = `documento_${getDateTime("", "", "")}.${
    props.value?.ext || "bin"
  }`;
  link.click();
};

// Inicialización
onMounted(() => {
  if (props.value && props.value.cnt && props.value.ext) {
    docUrl.value = URL.createObjectURL(
      getBlob(props.value.cnt, props.value.ext)
    );
  }
});
</script>
