<template>
  <v-btn
    type="button"
    icon
    :variant="variant"
    :size="size"
    :aria-label="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
    @click="toggleTheme"
  >
    <v-icon>mdi-brightness-6</v-icon>
    <v-tooltip activator="parent" location="bottom"> Cambiar tema </v-tooltip>
  </v-btn>
</template>

<script setup>
// Libraries
import { computed } from "vue";

// Vuetify
import { useTheme } from "vuetify";

// Store
import { useStore } from "@/store";

const props = defineProps({
  variant: { type: String, default: "text" },
  size: { type: String, default: "small" },
});

const store = useStore();
const theme = useTheme();

const isDark = computed(() => store.conf.theme_dark);

const setTheme = (val) => {
  if (val === isDark.value) return;

  store.themeDarkAction();
  theme.change(val ? "dark" : "light");
};

const toggleTheme = () => setTheme(!isDark.value);
</script>
