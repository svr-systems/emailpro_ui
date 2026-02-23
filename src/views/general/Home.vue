<template>
  <v-row justify="center" class="text-center">
    <v-col cols="12" class="pt-3" />
    <v-col cols="12">
      <div class="text-h5 font-weight-light">Bienvenido</div>
    </v-col>

    <v-col v-if="store.auth?.user.role_id == 3" cols="12">
      <v-row dense>
        <v-col cols="12" class="pt-4">
          <v-btn
            variant="text"
            size="x-small"
            :to="{
              name: 'doctor/user_fiscal_data/show',
              params: { id: getEncodeId(store.auth?.user.id) },
            }"
          >
            Cargar datos fiscales
          </v-btn>
        </v-col>
        <v-col cols="12" class="pt-4">
          <v-btn
            variant="text"
            size="x-small"
            :to="{
              name: 'doctor/facturapi_data/show',
              params: { id: getEncodeId(store.auth?.user.id) },
            }"
          >
            Cargar documentos fiscales
          </v-btn>
        </v-col>
        <v-col cols="12" class="pt-4">
          <v-btn
            variant="text"
            size="x-small"
            :to="{
              name: 'doctor/user_bank_data/show',
              params: { id: getEncodeId(store.auth?.user.id) },
            }"
          >
            Cargar datos bancarios
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { getEncodeId } from "@/utils/coders";

const router = useRouter();
const store = useStore();
</script>
