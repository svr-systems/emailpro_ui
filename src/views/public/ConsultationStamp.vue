<template>
  <v-row justify="center">
    <v-col cols="12" md="8" class="mt-11">
      <v-card
        elevation="24"
        class="py-4 px-4"
        :loading="isLoading"
        :disabled="isLoading"
      >
        <v-card-text>
          <v-row dense>
            <v-col cols="12" class="text-right" style="height: 40px">
              <BtnTheme size="x-small" />
            </v-col>

            <v-col cols="12" class="text-center">
              <Logo height="78" />
            </v-col>

            <v-col cols="12" v-if="!item && isLoading" class="text-center">
              <div class="py-6">Validando información</div>
            </v-col>

            <v-col cols="12" v-else>
              <v-row dense v-if="billed" class="text-center py-8">
                <v-col cols="12">
                  <v-icon size="50" color="success" class="mb-4">
                    mdi-check-circle
                  </v-icon>

                  <div class="text-body-1">
                    Esta consulta ya ha sido facturada.
                  </div>
                  <div class="text-body-2 mt-1">
                    Revise su correo electrónico.
                  </div>
                </v-col>
              </v-row>

              <v-row dense v-else-if="item">
                <v-col cols="12">
                  <div class="text-disabled text-center mb-1">
                    Datos de consulta
                  </div>
                </v-col>

                <v-col cols="12" class="text-center">
                  <v-row dense>
                    <v-col cols="12" md="4">
                      <VisVal label="Folio" :value="consultation?.folio" />
                    </v-col>
                    <v-col cols="12" md="4">
                      <VisVal
                        label="Monto"
                        :value="getAmountFormat(consultation?.charge_amount)"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <VisVal label="Fecha" :value="consultation?.date" />
                    </v-col>
                    <v-col cols="12" md="4">
                      <VisVal label="Doctor" :value="consultation?.doctor" />
                    </v-col>
                    <v-col cols="12" md="4">
                      <VisVal label="ID" :value="consultation?.uiid" />
                    </v-col>
                    <v-col cols="12" md="4">
                      <VisVal label="Paciente" :value="consultation?.patient" />
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" class="py-5">
                  <v-divider />
                </v-col>

                <v-col cols="12" v-if="!showInvoce">
                  <v-form ref="formRef" @submit.prevent="handleAction">
                    <v-row dense>
                      <v-col cols="12">
                        <div class="text-disabled text-center mb-1">
                          Datos de factura
                        </div>
                      </v-col>
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
                      <v-col cols="12">
                        <v-btn
                          block
                          color="success"
                          type="submit"
                          class="text-none"
                          :loading="isLoading"
                        >
                          Facturar
                          <v-icon end>mdi-invoice-check</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-col>

                <v-col v-else cols="12" class="pt-5">
                  <v-row dense class="text-center">
                    <v-col cols="12" class="pt-2">
                      <v-icon size="36" color="success"
                        >mdi-check-circle</v-icon
                      >
                    </v-col>

                    <v-col cols="12">
                      <div class="text-body-2">
                        Factura generada correctamente.
                        <br />
                        Hemos enviado los archivos al correo registrado. También
                        puedes descargarlos aquí:
                      </div>

                      <v-row class="mt-2">
                        <v-col cols="12" md="6">
                          <VisDoc
                            label="Descargar (PDF)"
                            :value="{ cnt: item.pdf, ext: 'pdf' }"
                          />
                        </v-col>

                        <v-col cols="12" md="6">
                          <VisDoc
                            label="Descargar (XML)"
                            :value="{ cnt: item.xml, ext: 'xml' }"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" class="pt-2 text-center">
              <Version />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";

import BtnTheme from "@/components/BtnTheme.vue";
import Logo from "@/components/Logo.vue";
import Version from "@/components/Version.vue";
import VisVal from "@/components/VisVal.vue";
import VisDoc from "@/components/VisDoc.vue";
import { getAmountFormat } from "@/utils/formatters";

const alert = inject("alert");
const confirm = inject("confirm");
const route = useRoute();

const itemId = route.params.id;

const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);
const consultation = ref(null);
const rules = getRules();

const fiscalRegimes = ref([]);
const fiscalRegimesLoading = ref(true);

const showInvoce = ref(false);
const billed = ref(false);

const getCatalogs = async () => {
  try {
    const endpoint = `${URL_API}/public/catalogs/fiscal_regimes`;
    const response = await axios.get(endpoint, getHdrs());

    fiscalRegimes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    fiscalRegimesLoading.value = false;
  }
};

const getItem = async () => {
  try {
    const endpoint = `${URL_API}/public/user_fiscal_data/${itemId}`;
    const response = await axios.get(endpoint, getHdrs());

    item.value = { ...getRsp(response).data.item };
    consultation.value = { ...getRsp(response).data.item.consultation };
    billed.value = consultation.value?.is_stamped;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const sendStamp = async () => {
  const payload = getObj({ consultation_id: itemId }, true);

  const endpoint = `${URL_API}/public/consultations/invoce/stamp`;
  const response = await axios.post(endpoint, payload, getHdrs());

  item.value = getRsp(response).data.item;
  showInvoce.value = true;
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
    const payload = getObj(item.value, true);

    const endpoint = `${URL_API}/public/user_fiscal_data/${itemId}`;
    await axios.post(endpoint, payload, getHdrs());

    await sendStamp();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getCatalogs();
  setTimeout(() => getItem(), 2500);
});
</script>
