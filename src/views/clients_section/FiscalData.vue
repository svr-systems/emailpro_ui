<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <CardTitle :text="$route.meta.title" :icon="$route.meta.icon" />
        </v-col>
        <v-col cols="2" class="text-right" />
      </v-row>
    </v-card-title>

    <v-card-text v-if="item">
      <v-form ref="formRef" @submit.prevent>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model.trim="item.code"
                      label="RFC"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="13"
                      counter
                      :rules="rules.fiscalCodeRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="9">
                    <v-text-field
                      v-model.trim="item.name"
                      label="Razón social"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-text-field
                      v-model.trim="item.zip"
                      label="Código postal"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="5"
                      counter
                      :rules="rules.zipRequired"
                    />
                  </v-col>

                  <v-col cols="12" md="9">
                    <v-select
                      v-model="item.fiscal_regime_id"
                      label="Régimen fiscal"
                      :items="fiscalRegimes"
                      :loading="fiscalRegimesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="9">
                    <v-select
                      v-model="item.cfdi_usage_id"
                      label="Uso de CFDI"
                      :items="cfdiUsage"
                      :loading="cdfiUsageLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <div class="text-right">
              <v-btn
                icon
                variant="flat"
                size="x-small"
                color="success"
                @click.prevent="handleAction"
                :loading="isLoading"
              >
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="left">
                  Continuar
                </v-tooltip>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import { URL_API } from "@/utils/config";
import { useStore } from "@/store";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";

import CardTitle from "@/components/CardTitle.vue";

const alert = inject("alert");
const confirm = inject("confirm");
const route = useRoute();
const store = useStore();

const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);
const consultation = ref(null);
const rules = getRules();

const fiscalRegimes = ref([]);
const fiscalRegimesLoading = ref(true);

const cfdiUsage = ref([]);
const cdfiUsageLoading = ref(true);

const getCatalogs = async () => {
  try {
    const endpoint = `${URL_API}/catalogs/fiscal_regimes`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));

    fiscalRegimes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    fiscalRegimesLoading.value = false;
  }

  try {
    const endpoint = `${URL_API}/catalogs/cfdi_usages`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));

    cfdiUsage.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    cdfiUsageLoading.value = false;
  }
};

const getItem = async () => {
  try {
    const endpoint = `${URL_API}/client/user_fiscal_data`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));

    item.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const handleAction = async () => {
  if (!formRef.value) return;

  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show(
    "¿Confirma que sus datos fiscales son correctos?"
  );
  if (!confirmed) return;

  isLoading.value = true;

  try {
    const payload = getObj(
      {
        code: item.value.code,
        name: item.value.name,
        zip: item.value.zip,
        fiscal_regime_id: item.value.fiscal_regime_id,
        cfdi_usage_id: item.value.cfdi_usage_id,
      },
      true
    );

    const endpoint = `${URL_API}/client/user_fiscal_data`;
    const response = getRsp(
      await axios.post(endpoint, payload, getHdrs(store.getAuth?.token))
    );

    alert?.show("success", response.msg);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Inicialización
onMounted(() => {
  getCatalogs();
  getItem();
});
</script>