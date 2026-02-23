<template>
  <img :src="computedSrc" v-bind="imgAttrs" class="pb-9" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  src: {
    type: String,
    default: null,
  },

  base64: {
    type: [String, Object],
    default: null,
  },

  width: {
    type: [Number, String],
    default: null,
  },

  height: {
    type: [Number, String],
    default: null,
  },
});

const defaultLogo = new URL("@/assets/logo.png", import.meta.url).href;

const computedSrc = computed(() => {
  if (props.base64 && typeof props.base64 === "object" && props.base64.cnt) {
    const mime = props.base64.mime || "image/png";
    return `data:${mime};base64,${props.base64.cnt}`;
  }

  if (typeof props.base64 === "string" && props.base64.trim() !== "") {
    return `data:image/png;base64,${props.base64}`;
  }

  if (props.src) return props.src;

  return defaultLogo;
});

const imgAttrs = computed(() => {
  if (props.width) {
    return {
      width: typeof props.width === "number" ? `${props.width}px` : props.width,
    };
  }

  if (props.height) {
    return {
      height:
        typeof props.height === "number" ? `${props.height}px` : props.height,
    };
  }

  return { width: "48px" };
});
</script>
