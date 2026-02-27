<template>
  <v-card elevation="24" :disabled="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{ name: 'domains', params: { id: getEncodeId(domainId) } }"
          />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col cols="2" class="text-right">
          <v-btn
            icon
            variant="flat"
            size="x-small"
            color="success"
            :to="{
              name: `${routeName}/store`,
              params: {
                email: getEncodeId(itemId),
                domain: getEncodeId(domainId),
              },
            }"
          >
            <v-icon>mdi-plus</v-icon>
            <v-tooltip activator="parent" location="bottom">Agregar</v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="9" class="pb-0">
          <v-row dense>
            <v-col
              v-if="[1, 2].includes(store.getAuth?.user?.role_id)"
              cols="12"
              md="3"
              class="pb-0"
            >
              <v-select
                v-model="isActive"
                label="Mostrar"
                variant="outlined"
                density="compact"
                :items="isActiveOptions"
                item-title="name"
                item-value="id"
                :disabled="!isItemsEmpty"
              />
            </v-col>
          </v-row>
        </v-col>

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
          <v-btn
            block
            size="small"
            :color="isItemsEmpty ? 'info' : 'grey-darken-1'"
            :loading="isItemsEmpty && isLoading"
            @click.prevent="isItemsEmpty ? getItems() : (items = [])"
          >
            {{ isItemsEmpty ? "Aplicar" : "Cambiar" }} filtros
            <v-icon right>mdi-filter</v-icon>
          </v-btn>
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

            <template #item.action="{ item }">
              <div class="text-right">
                <v-btn
                  icon
                  variant="text"
                  size="x-small"
                  :color="item.is_active ? '' : 'red-darken-3'"
                  :to="{
                    name: `${routeName}/show`,
                    params: {
                      id: getEncodeId(item.id),
                      email: getEncodeId(itemId),
                      domain: getEncodeId(domainId),
                    },
                  }"
                >
                  <v-icon>mdi-eye</v-icon>
                  <v-tooltip activator="parent" location="left"
                    >Detalle</v-tooltip
                  >
                </v-btn>
              </div>
            </template>
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
const domainId = ref(
  route.params.domain ? getDecodeId(route.params.domain) : null
);
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
  { title: "#", key: "key", filterable: false, sortable: false, width: 60 },
  { title: "Correo", key: "email" },
  { title: "", key: "action", filterable: false, sortable: false, width: 60 },
];

// Cargar registros
const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/domains/${routeName}`;
    const response = await axios.get(endpoint, {
      params: {
        is_active: isActive.value,
        domain_id: itemId.value,
      },
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
