<template>
  <v-card elevation="24" :disabled="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack :route="{ name: 'client_domains' }" />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="9" class="pb-0"> </v-col>

        <v-col cols="12" md="3" class="pb-0">
          <v-text-field
            v-model="search"
            label="Buscar"
            type="text"
            variant="outlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            :disabled="isItemsEmpty"
          />
        </v-col>

        <v-col cols="12">
          <v-data-table
            density="compact"
            :items="items"
            :headers="headers"
            :search="search"
            :items-per-page="15"
            :loading="isLoading"
          >
            <template #item.key="{ item }">
              <b>{{ item.key + 1 }}</b>
            </template>

            <template #item.lab_programs="{ item }">
              <span class="text-description">
                {{ item.lab_programs }}
              </span>
            </template>

            <template #item.action="{ item }"> </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
// Importaciones externas
import { ref, computed, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

// Importaciones internas
import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import CardTitle from "@/components/CardTitle.vue";
import BtnBack from "@/components/BtnBack.vue";

// Constantes
const routeName = "emails";
const alert = inject("alert");
const store = useStore();
const route = useRoute();

// Estado
const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(true);
const items = ref([]);
const search = ref("");
const isActive = ref(1);
const program_id = ref(0);
const programs = ref([]);
const programsLoading = ref(true);

const isItemsEmpty = computed(() => items.value.length === 0);

// Opciones y headers
const isActiveOptions = [
  { id: 1, name: "ACTIVOS" },
  { id: 0, name: "INACTIVOS" },
];
const filterOptions = [{ id: 0, name: "TODOS" }];

const headers = [
  { title: "#", key: "key"},
  { title: "Correo", key: "email" },
];

// Cargar registros
const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/client/domains/${itemId.value}/${routeName}`;
    const response = await axios.get(endpoint, {
      ...getHdrs(store.getAuth?.token),
    });
    items.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Cargar datos al montar
onMounted(() => {
  getItems();
});
</script>
