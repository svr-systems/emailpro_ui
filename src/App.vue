<template>
  <v-app>
    <Alert ref="alert" />
    <Confirm ref="confirm" />
    <NavBar v-if="auth" />

    <v-main>
      <v-container>
        <router-view :key="$route.fullPath" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
// Importaciones de librerías
import { ref, computed, provide } from "vue";

// Importaciones internas del proyecto
import { useStore } from "@/store";
import Alert from "@/components/Alert.vue";
import Confirm from "@/components/Confirm.vue";
import NavBar from "@/components/NavBar.vue";

// Estado y referencias
const store = useStore();
const alert = ref(null);
const confirm = ref(null);
const auth = computed(() => store.getAuth);

// Proveedores globales
provide("alert", {
  show: (color, msg) => alert.value?.show(color, msg),
});

provide("confirm", {
  show: (options) => confirm.value?.show(options),
});
</script>

<style>
@import "@/style.css";
</style>
