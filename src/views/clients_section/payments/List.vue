<template>
  <v-card elevation="24" :disabled="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack :route="{ name: 'client_domains' }" />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col cols="2" class="text-right">
          <v-btn
            variant="flat"
            size="small"
            color="warning"
            :loading="openDialogLoading"
            @click.prevent="openPaymentDialog"
          >
            Renovar
          </v-btn>
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

  <v-dialog v-model="paymentDialog" max-width="800" persistent>
    <v-card
      elevation="24"
      :disabled="isProcessingPayment"
      :loading="isProcessingPayment"
      class="animated-dialog"
    >
      <v-card-title>
        <v-row dense>
          <v-col cols="10">
            <CardTitle text="Procesar Pago" icon="mdi-credit-card" />
          </v-col>
          <v-col cols="2" class="text-right">
            <v-btn
              icon
              variant="text"
              size="small"
              @click="paymentDialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text v-if="item">
        <v-form ref="paymentFormRef" @submit.prevent="processPayment">
          <v-card class="mb-4">
            <v-card-title>
              <v-row dense>
                <v-col cols="10">
                  <CardTitle text="DATOS GENERALES" sub />
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <div>
                <v-row dense>
                  <v-col cols="12" md="4">
                    <VisVal
                      label="No. de correos"
                      :value="domain.email_accounts"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <VisVal
                      label="Precio por correo"
                      :value="getAmountFormat(domain?.email_price || 0)"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      label="Expiración"
                      v-model="item.expiration_date_id"
                      :items="expiration_dates"
                      :loading="expiration_datesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>

          <v-card class="mb-4">
            <v-card-title>
              <v-row dense>
                <v-col cols="11">
                  <CardTitle text="INFORMACIÓN DE PAGO" sub />
                </v-col>
                <v-col cols="1" class="text-right" />
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12">
                  <div
                    v-if="!showCardsList && selectedCard"
                    class="selected-card-wrapper"
                  >
                    <div class="card-item" :style="getCardStyle(selectedCard)">
                      <div class="card-content">
                        <div class="card-logo">
                          <v-img
                            :src="getBrandLogo(selectedCard.brand)"
                            width="50"
                            height="35"
                            contain
                          />
                        </div>

                        <div class="card-info">
                          <div class="card-main-info">
                            <div class="card-number">
                              {{ selectedCard.card_number }}
                            </div>
                            <div class="card-holder">
                              <div class="label">Titular</div>
                              <div class="value">
                                {{ selectedCard.holder_name }}
                              </div>
                            </div>
                          </div>

                          <div class="card-secondary-info">
                            <div class="card-expiry">
                              <div class="label">Válida hasta</div>
                              <div class="value">
                                {{
                                  formatExpiry(
                                    selectedCard.expiration_month,
                                    selectedCard.expiration_year
                                  )
                                }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="text-center mt-4">
                      <v-btn
                        variant="outlined"
                        size="small"
                        @click="showCardsList = true"
                        prepend-icon="mdi-credit-card-multiple"
                      >
                        Cambiar tarjeta
                      </v-btn>
                    </div>
                  </div>

                  <div v-if="showCardsList" class="cards-list-container">
                    <div class="d-flex justify-space-between align-center mb-4">
                      <div class="text-h6">Selecciona una tarjeta</div>
                      <div>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          class="mr-2"
                          color="success"
                          @click="openAddCardDialog"
                        >
                          <v-icon>mdi-plus</v-icon>
                          <v-tooltip activator="parent" location="bottom">
                            Agregar tarjeta
                          </v-tooltip>
                        </v-btn>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          @click="showCardsList = false"
                        >
                          <v-icon>mdi-close</v-icon>
                          <v-tooltip activator="parent" location="left">
                            Cerrar
                          </v-tooltip>
                        </v-btn>
                      </div>
                    </div>

                    <v-row dense>
                      <v-col
                        v-for="card in userCards"
                        :key="card.id"
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <div
                          class="card-selectable-item"
                          :class="{
                            selected:
                              selectedCard && selectedCard.id === card.id,
                          }"
                          :style="getCardStyle(card)"
                          @click="selectCard(card)"
                        >
                          <div class="card-content">
                            <div class="card-logo">
                              <v-img
                                :src="getBrandLogo(card.brand)"
                                width="40"
                                height="30"
                                contain
                              />
                            </div>

                            <div class="card-info">
                              <div class="card-main-info">
                                <div class="card-number">
                                  {{ card.card_number }}
                                </div>
                              </div>

                              <div class="card-secondary-info">
                                <div class="card-expiry">
                                  <div class="label">Válida hasta</div>
                                  <div class="value">
                                    {{
                                      formatExpiry(
                                        card.expiration_month,
                                        card.expiration_year
                                      )
                                    }}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              v-if="selectedCard && selectedCard.id === card.id"
                              class="card-selected-check"
                            >
                              <v-icon size="20" color="white"
                                >mdi-check-circle</v-icon
                              >
                            </div>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-col cols="12" class="mb-2 pl-6">
            <v-switch
              v-model="enableInvoice"
              label="Necesito factura"
              color="success"
              hide-details
              density="compact"
            />
          </v-col>

          <v-col cols="12" v-if="enableInvoice">
            <v-card class="mb-4">
              <v-card-title>
                <v-row dense>
                  <v-col cols="11">
                    <CardTitle text="INFORMACIÓN FISCAL" sub />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <div v-if="!showEditFiscal">
                  <v-row dense>
                    <v-col cols="12" md="3">
                      <VisVal
                        label="RFC"
                        :value="fiscalData?.code || 'No disponible'"
                      />
                    </v-col>
                    <v-col cols="12" md="9">
                      <VisVal
                        label="Razón social"
                        :value="fiscalData?.name || 'No disponible'"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <VisVal
                        label="Código postal"
                        :value="fiscalData?.zip || 'No disponible'"
                      />
                    </v-col>
                    <v-col cols="12" md="9">
                      <VisVal
                        label="Régimen fiscal"
                        :value="fiscalData?.fiscal_regime.name"
                      />
                    </v-col>
                    <v-col cols="12" md="9">
                      <VisVal
                        label="Uso de CFDI"
                        :value="fiscalData?.cfdi_usage.name"
                      />
                    </v-col>
                  </v-row>

                  <v-col cols="12" class="mt-4 text-center">
                    <v-btn
                      variant="outlined"
                      size="small"
                      @click="showEditFiscal = true"
                      prepend-icon="mdi-pencil"
                    >
                      Editar datos fiscales
                    </v-btn>
                  </v-col>
                </div>

                <div v-if="showEditFiscal">
                  <v-row dense>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model.trim="fiscalData.code"
                        label="RFC"
                        type="text"
                        variant="outlined"
                        density="compact"
                        maxlength="13"
                        counter
                        :rules="enableInvoice ? rules.fiscalCodeRequired : []"
                      />
                    </v-col>
                    <v-col cols="12" md="9">
                      <v-text-field
                        v-model.trim="fiscalData.name"
                        label="Razón social"
                        type="text"
                        variant="outlined"
                        density="compact"
                        maxlength="50"
                        counter
                        :rules="enableInvoice ? rules.textRequired : []"
                      />
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model.trim="fiscalData.zip"
                        label="Código postal"
                        type="text"
                        variant="outlined"
                        density="compact"
                        maxlength="5"
                        counter
                        :rules="enableInvoice ? rules.zipRequired : []"
                      />
                    </v-col>

                    <v-col cols="12" md="9">
                      <v-select
                        v-model="fiscalData.fiscal_regime_id"
                        label="Régimen fiscal"
                        :items="fiscalRegimes"
                        :loading="fiscalRegimesLoading"
                        item-value="id"
                        item-title="name"
                        variant="outlined"
                        density="compact"
                        :rules="enableInvoice ? rules.required : []"
                      />
                    </v-col>
                    <v-col cols="12" md="9">
                      <v-select
                        v-model="fiscalData.cfdi_usage_id"
                        label="Uso de CFDI"
                        :items="cfdiUsage"
                        :loading="cdfiUsageLoading"
                        item-value="id"
                        item-title="name"
                        variant="outlined"
                        density="compact"
                        :rules="enableInvoice ? rules.required : []"
                      />
                    </v-col>

                    <v-col cols="12" class="mt-4 text-center">
                      <v-btn
                        color="error"
                        class="mr-2"
                        variant="outlined"
                        size="small"
                        @click="
                          showEditFiscal = false;
                          resetFiscalData();
                        "
                        prepend-icon="mdi-close"
                        :disabled="savingFiscalData"
                      >
                        Cancelar
                      </v-btn>
                      <v-btn
                        color="success"
                        size="small"
                        @click="saveFiscalData"
                        prepend-icon="mdi-check"
                        :loading="savingFiscalData"
                      >
                        Guardar cambios
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-card>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" class="text-center">
                  <div class="text-disabled text-center mb-1">Total</div>
                  <div class="text-h4 font-weight-light">
                    {{ getAmountFormat(calculatedTotal) }}
                  </div>
                </v-col>

                <v-col cols="12" class="pt-2">
                  <v-btn
                    block
                    color="success"
                    type="submit"
                    class="text-none"
                    :loading="isProcessingPayment"
                    :disabled="!selectedCard"
                  >
                    Pagar con tarjeta seleccionada
                    <v-icon end>mdi-lock-check</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="addCardDialog" max-width="600" persistent>
    <v-card elevation="24" :loading="isAddingCard" class="animated-dialog">
      <v-card-title>
        <v-row dense>
          <v-col cols="10">
            <CardTitle text="Agregar Tarjeta" icon="mdi-credit-card-plus" />
          </v-col>
          <v-col cols="2" class="text-right">
            <v-btn
              icon
              variant="text"
              size="small"
              @click="addCardDialog = false"
            >
              <v-icon>mdi-close</v-icon>
              <v-tooltip activator="parent" location="left"> Cerrar </v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-form ref="addCardFormRef" @submit.prevent="saveNewCard">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="newCard.cardNumber"
                label="Número de tarjeta"
                type="text"
                variant="outlined"
                density="compact"
                :counter="cardNumberMaxLength"
                :maxlength="cardNumberMaxLength + 3"
                :rules="[...rules.textRequired, cardRules.cardNumber]"
                :hint="cardBrandName ? `Tarjeta ${cardBrandName}` : ''"
                persistent-hint
                prepend-inner-icon="mdi-credit-card"
                hide-details="auto"
                @blur="detectCardBrand"
                @input="formatCardNumberInput"
              >
                <template #append-inner>
                  <v-img
                    v-if="cardBrandIcon"
                    :src="cardBrandIcon"
                    width="40"
                    height="30"
                    contain
                    class="mt-1"
                  />
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.trim="newCard.cardHolder"
                label="Nombre del titular"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="50"
                :rules="rules.textRequired"
                prepend-inner-icon="mdi-account"
                hide-details="auto"
                autocomplete="cc-name"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                v-model="newCard.expirationMonth"
                :items="months"
                label="Mes"
                variant="outlined"
                density="compact"
                :rules="rules.textRequired"
                prepend-inner-icon="mdi-calendar"
                hide-details="auto"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                v-model="newCard.expirationYear"
                :items="years"
                label="Año"
                variant="outlined"
                density="compact"
                :rules="rules.textRequired"
                prepend-inner-icon="mdi-calendar-month"
                hide-details="auto"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                v-model="newCard.cvv2"
                label="CVV"
                :type="showCvv ? 'text' : 'password'"
                variant="outlined"
                density="compact"
                maxlength="4"
                :rules="[...rules.textRequired, cardRules.cardCvv]"
                prepend-inner-icon="mdi-lock"
                hide-details="auto"
                autocomplete="cc-csc"
              >
                <template #append-inner>
                  <v-btn
                    type="button"
                    icon
                    variant="text"
                    size="x-small"
                    :aria-label="showCvv ? 'Ocultar CVV' : 'Mostrar CVV'"
                    @click.stop="showCvv = !showCvv"
                  >
                    <v-icon size="18">
                      {{ showCvv ? "mdi-eye-off" : "mdi-eye" }}
                    </v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" class="pt-2 pl-4">
              <v-switch
                v-model="newCard.isDefault"
                label="Establecer como tarjeta principal"
                color="success"
                hide-details
                density="compact"
              />
              <div class="text-caption text-medium-emphasis ml-8">
                Esta tarjeta se usará por defecto en tus pagos
              </div>
            </v-col>

            <v-col cols="12" class="text-right pt-4">
              <v-btn
                icon
                variant="flat"
                color="success"
                type="submit"
                class="text-none"
                size="x-small"
                :loading="isAddingCard"
              >
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="left">
                  Guardar tarjeta
                </v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
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
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";
import { getAmountFormat } from "@/utils/formatters";
import { getDecodeId, getEncodeId } from "@/utils/coders";

// Componentes
import CardTitle from "@/components/CardTitle.vue";
import BtnBack from "@/components/BtnBack.vue";
import VisVal from "@/components/VisVal.vue";

// Constantes
const routeName = "payments";
const alert = inject("alert");
const store = useStore();
const route = useRoute();

// Estado
const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(false);
const items = ref([]);
const item = ref({
  expiration_date_id: null,
});
const domain = ref(null);
const search = ref("");
const isActive = ref(1);
const program_id = ref(0);
const programs = ref([]);
const programsLoading = ref(true);

const isItemsEmpty = computed(() => items.value.length === 0);

// Refs pagos
const openDialogLoading = ref(false);
const paymentDialog = ref(false);
const isProcessingPayment = ref(false);
const paymentFormRef = ref(null);
const fiscalData = ref(null);
const originalFiscalData = ref(null);
const savingFiscalData = ref(false);
const rules = getRules();

const fiscalRegimes = ref([]);
const fiscalRegimesLoading = ref(true);

const cfdiUsage = ref([]);
const cdfiUsageLoading = ref(true);

const expiration_dates = ref([]);
const expiration_datesLoading = ref(true);

const showPayment = ref(false);
const paid = ref(false);
const showEditFiscal = ref(false);

// Switches
const enableInvoice = ref(false);
const enableRecurringPayment = ref(false);

// Variables para tarjetas
const userCards = ref([]);
const selectedCard = ref(null);
const showCardsList = ref(false);
const cardsLoading = ref(false);

// Variables para agregar tarjeta
const addCardDialog = ref(false);
const isAddingCard = ref(false);
const addCardFormRef = ref(null);
const showCvv = ref(false);

const newCard = ref({
  cardNumber: "",
  cardHolder: "",
  expirationMonth: "",
  expirationYear: "",
  cvv2: "",
  isDefault: false,
});

const cardBrand = ref("");
const cardBrandIcon = ref("");
const cardBrandName = ref("");

const months = ref([
  { title: "01", value: "01" },
  { title: "02", value: "02" },
  { title: "03", value: "03" },
  { title: "04", value: "04" },
  { title: "05", value: "05" },
  { title: "06", value: "06" },
  { title: "07", value: "07" },
  { title: "08", value: "08" },
  { title: "09", value: "09" },
  { title: "10", value: "10" },
  { title: "11", value: "11" },
  { title: "12", value: "12" },
]);

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const maxYears = 10;
  const yearsList = [];

  for (let i = 0; i <= maxYears; i++) {
    const year = currentYear + i;
    const shortYear = (year % 100).toString().padStart(2, "0");

    yearsList.push({
      title: shortYear,
      value: shortYear,
      fullYear: year.toString(),
    });
  }

  return yearsList;
});

const cardNumberMaxLength = computed(() => {
  if (cardBrand.value === "amex") return 15;
  return 16;
});

const isOpenPayReady = ref(false);
const deviceSessionId = ref("");
const tokenId = ref(null);

const openpayConfig = {
  id: "mvqklc5fv1rsuqrttndt",
  apikey: "pk_53706e08f72e45c585a55809e81636df",
};

// Función para resetear datos fiscales a los originales
const resetFiscalData = () => {
  if (originalFiscalData.value) {
    fiscalData.value = { ...originalFiscalData.value };
  }
};

// Función para guardar los datos fiscales
const saveFiscalData = async () => {
  savingFiscalData.value = true;

  try {
    if (
      !fiscalData.value.code ||
      !fiscalData.value.name ||
      !fiscalData.value.zip ||
      !fiscalData.value.fiscal_regime_id ||
      !fiscalData.value.cfdi_usage_id
    ) {
      alert?.show(
        "red-darken-1",
        "Por favor, completa todos los campos requeridos"
      );
      savingFiscalData.value = false;
      return;
    }

    const payload = getObj(
      {
        code: fiscalData.value.code,
        name: fiscalData.value.name,
        zip: fiscalData.value.zip,
        fiscal_regime_id: fiscalData.value.fiscal_regime_id,
        cfdi_usage_id: fiscalData.value.cfdi_usage_id,
      },
      true
    );

    const endpoint = `${URL_API}/client/user_fiscal_data`;
    const response = await axios.post(
      endpoint,
      payload,
      getHdrs(store.getAuth?.token)
    );
    const result = getRsp(response);

    originalFiscalData.value = { ...fiscalData.value };

    alert?.show(
      "green-darken-1",
      result.msg || "Datos fiscales actualizados exitosamente"
    );
    showEditFiscal.value = false;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    savingFiscalData.value = false;
  }
};

// Obtener tarjetas del usuario
const getUserCards = async () => {
  cardsLoading.value = true;
  try {
    const endpoint = `${URL_API}/client/cards`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    userCards.value = getRsp(response).data.items || [];

    const favoriteCard = userCards.value.find((card) => card.is_favorite);
    if (favoriteCard) {
      selectedCard.value = favoriteCard;
    } else if (userCards.value.length > 0) {
      selectedCard.value = userCards.value[0];
    }
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    cardsLoading.value = false;
  }
};

// Función para seleccionar una tarjeta
const selectCard = (card) => {
  selectedCard.value = card;
  showCardsList.value = false;
};

// Funciones auxiliares para formato de tarjetas
const getBrandLogo = (brand) => {
  const logos = {
    visa: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
    mastercard:
      "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    amex: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
    discover:
      "https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg",
  };
  return logos[brand?.toLowerCase()] || logos.visa;
};

const getCardStyle = (card) => {
  const colors = {
    visa: "#1a237e",
    mastercard: "#ff6f00",
    amex: "#2e7d32",
    discover: "#6a1b9a",
    default: "#616161",
  };

  const brand = card.brand?.toLowerCase();
  const color = colors[brand] || colors.default;

  return {
    "--card-color": color,
  };
};

const formatExpiry = (month, year) => {
  const formattedMonth = month?.toString().padStart(2, "0") || "01";
  const formattedYear = year?.toString().padStart(2, "0") || "00";
  return `${formattedMonth}/${formattedYear}`;
};

// Funciones para detección de marca de tarjeta
const detectCardBrand = () => {
  const num = newCard.value.cardNumber.replace(/\s/g, "");

  if (/^4/.test(num)) {
    cardBrand.value = "visa";
    cardBrandName.value = "Visa";
    cardBrandIcon.value =
      "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg";
    return;
  }

  if (/^5[1-5]/.test(num)) {
    cardBrand.value = "mastercard";
    cardBrandName.value = "Mastercard";
    cardBrandIcon.value =
      "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg";
    return;
  }

  if (/^3[47]/.test(num)) {
    cardBrand.value = "amex";
    cardBrandName.value = "American Express";
    cardBrandIcon.value =
      "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg";
    return;
  }

  if (/^(6011|65|64[4-9])/.test(num)) {
    cardBrand.value = "discover";
    cardBrandName.value = "Discover";
    cardBrandIcon.value =
      "https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg";
    return;
  }

  cardBrand.value = "";
  cardBrandName.value = "";
  cardBrandIcon.value = "";
};

const formatCardNumberInput = () => {
  let num = newCard.value.cardNumber.replace(/\s/g, "").replace(/\D+/g, "");

  if (cardBrand.value === "amex") {
    num = num.replace(/(\d{4})(\d{6})(\d{0,5})/, "$1 $2 $3").trim();
  } else {
    num = num.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  }

  newCard.value.cardNumber = num.substring(0, cardNumberMaxLength.value + 3);

  if (num.replace(/\s/g, "").length >= 2) {
    detectCardBrand();
  }
};

// Reglas de validación para tarjetas
const cardRules = {
  cardNumber: (value) => {
    const num = value?.replace(/\s/g, "") || "";
    const validLength = cardBrand.value === "amex" ? 15 : 16;

    if (num.length !== validLength) {
      return `El número de tarjeta debe tener ${validLength} dígitos`;
    }

    let sum = 0;
    let isEven = false;

    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0 || "Número de tarjeta inválido";
  },

  cardExpiry: () => {
    const currentYear = new Date().getFullYear();
    const currentYearShort = currentYear % 100;
    const currentMonth = new Date().getMonth() + 1;

    const selectedYearShort = parseInt(newCard.value.expirationYear);
    const selectedMonth = parseInt(newCard.value.expirationMonth);

    const selectedYearObj = years.value.find(
      (year) => parseInt(year.value) === selectedYearShort
    );

    const selectedYearFull = selectedYearObj
      ? parseInt(selectedYearObj.fullYear)
      : currentYear - (currentYear % 100) + selectedYearShort;

    if (!selectedYearFull || selectedYearFull < currentYear) {
      return "Selecciona un año válido";
    }

    if (selectedYearFull === currentYear && selectedMonth < currentMonth) {
      return "La tarjeta ya está expirada";
    }

    return true;
  },

  cardCvv: (value) => {
    const length = cardBrand.value === "amex" ? 4 : 3;
    const regex = cardBrand.value === "amex" ? /^\d{4}$/ : /^\d{3}$/;

    if (!regex.test(value || "")) {
      return `El CVV debe tener ${length} dígitos`;
    }

    return true;
  },
};

// Función para abrir diálogo de agregar tarjeta
const openAddCardDialog = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentYearShort = (currentYear % 100).toString().padStart(2, "0");
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");

  newCard.value = {
    cardNumber: "",
    cardHolder: "",
    expirationMonth: currentMonth,
    expirationYear: currentYearShort,
    cvv2: "",
    isDefault: userCards.value.length === 0,
  };
  cardBrand.value = "";
  cardBrandIcon.value = "";
  cardBrandName.value = "";
  showCvv.value = false;

  addCardDialog.value = true;
};

// Función para guardar nueva tarjeta
const saveNewCard = async () => {
  if (!addCardFormRef.value) return;

  const { valid } = await addCardFormRef.value.validate();
  if (!valid) {
    alert?.show(
      "red-darken-1",
      "Por favor, completa correctamente la información de la tarjeta"
    );
    return;
  }

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentYearShort = currentYear % 100;

  const selectedYearShort = parseInt(newCard.value.expirationYear);
  const selectedMonth = parseInt(newCard.value.expirationMonth);

  const selectedYearObj = years.value.find(
    (year) => parseInt(year.value) === selectedYearShort
  );

  const selectedYearFull = selectedYearObj
    ? parseInt(selectedYearObj.fullYear)
    : currentYear - (currentYear % 100) + selectedYearShort;

  if (selectedYearFull < currentYear) {
    alert?.show("red-darken-1", "El año seleccionado ya ha pasado");
    return;
  }

  if (selectedYearFull === currentYear && selectedMonth < currentMonth) {
    alert?.show("red-darken-1", "La tarjeta ya está expirada");
    return;
  }

  isAddingCard.value = true;

  try {
    const payload = {
      holder_name: newCard.value.cardHolder.toUpperCase(),
      card_number: newCard.value.cardNumber.replace(/\s/g, ""),
      cvv2: newCard.value.cvv2,
      expiration_month: newCard.value.expirationMonth,
      expiration_year: newCard.value.expirationYear,
      is_favorite: newCard.value.isDefault ? 1 : 0,
    };

    const endpoint = `${URL_API}/client/cards`;
    await axios.post(endpoint, payload, getHdrs(store.getAuth?.token));

    await getUserCards();

    addCardDialog.value = false;

    if (newCard.value.isDefault) {
      const newFavoriteCard = userCards.value.find((card) => card.is_favorite);
      if (newFavoriteCard) {
        selectedCard.value = newFavoriteCard;
      }
    }

    alert?.show("success", "Tarjeta agregada exitosamente");
  } catch (err) {
    alert?.show("red-darken-1", getErr(err) || "Error al guardar la tarjeta");
  } finally {
    isAddingCard.value = false;
  }
};

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

  try {
    const endpoint = `${URL_API}/catalogs/expiration_dates`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));

    expiration_dates.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    expiration_datesLoading.value = false;
  }
};

const initializeOpenPay = () => {
  if (typeof OpenPay === "undefined") {
    alert?.show("red-darken-1", "No se pudo inicializar el sistema de pagos");
    return;
  }

  try {
    OpenPay.setId(openpayConfig.id);
    OpenPay.setApiKey(openpayConfig.apikey);
    OpenPay.setSandboxMode(true);

    deviceSessionId.value = OpenPay.deviceData.setup();
    isOpenPayReady.value = true;
  } catch (err) {
    alert?.show("red-darken-1", "Error al inicializar el sistema de pagos");
  }
};

const openPaymentDialog = async () => {
  openDialogLoading.value = true;

  try {
    await getUserCards();

    if (userCards.value.length === 0) {
      alert?.show(
        "warning",
        "No tienes tarjetas registradas. Por favor, agrega una tarjeta para continuar."
      );
      openAddCardDialog();
      openDialogLoading.value = false;
      return;
    }

    enableInvoice.value = false;
    enableRecurringPayment.value = false;
    showEditFiscal.value = false;

    showCardsList.value = false;

    paymentDialog.value = true;
  } finally {
    openDialogLoading.value = false;
  }
};

// Total calculado basado en número de correos y precio por correo
const calculatedTotal = computed(() => {
  if (!domain.value) return 0;

  const emailCount = parseInt(domain.value.email_accounts) || 0;
  const emailPrice = parseFloat(domain.value.email_price) || 0;

  const total = emailCount * emailPrice;
  return Math.round(total * 100) / 100;
});

const processPayment = async () => {
  if (!paymentFormRef.value) return;

  if (!selectedCard.value) {
    alert?.show("red-darken-1", "Por favor, selecciona una tarjeta para pagar");
    return;
  }

  isProcessingPayment.value = true;

  try {
    const payload = getObj(
      {
        total: calculatedTotal.value.toString(),
        token_id: selectedCard.value.card_id,
        device_session_id: deviceSessionId.value,
        use_card_points: null,
        is_invoice_required: enableInvoice.value,
        domain_id: itemId.value,
        expiration_date_id: item.value.expiration_date_id,
      },
      true
    );

    const endpoint = `${URL_API}/client/payments`;
    await axios.post(endpoint, payload, getHdrs(store.getAuth?.token));

    paymentDialog.value = false;
    showPayment.value = true;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isProcessingPayment.value = false;
  }
};

// Opciones y headers
const isActiveOptions = [
  { id: 1, name: "ACTIVOS" },
  { id: 0, name: "INACTIVOS" },
];
const filterOptions = [{ id: 0, name: "TODOS" }];

const headers = [
  { title: "#", key: "key" },
  { title: "Expiración", key: "expiration_date.name" },
  { title: "Monto", key: "amount" },
];

// Cargar registros
const getItems = async () => {
  isLoading.value = true;

  try {
    const endpoint1 = `${URL_API}/client/${routeName}`;
    const response1 = await axios.get(endpoint1, {
      params: {
        domain_id: itemId.value,
      },
      ...getHdrs(store.getAuth?.token),
    });
    items.value = getRsp(response1).data.items;

    const endpoint2 = `${URL_API}/client/domains/${itemId.value}`;
    const response2 = await axios.get(endpoint2, getHdrs(store.getAuth?.token));
    domain.value = getRsp(response2).data.items;

    const endpoint3 = `${URL_API}/client/user_fiscal_data`;
    const response3 = await axios.get(endpoint3, getHdrs(store.getAuth?.token));
    fiscalData.value = getRsp(response3).data.item;
    originalFiscalData.value = { ...fiscalData.value };
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Cargar datos al montar
onMounted(() => {
  getItems();
  getCatalogs();
  initializeOpenPay();
});
</script>

<style scoped>
.animated-dialog {
  animation: dialog-appear 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes dialog-appear {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.selected-card-wrapper {
  max-width: 400px;
  margin: 0 auto;
}

.card-item {
  width: 75%;
  height: 160px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, var(--card-color, #1a237e), #3949ab);
  color: white;
  position: relative;
  margin: 0 auto;
}

.card-selectable-item {
  width: 100%;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, var(--card-color, #1a237e), #3949ab);
  color: white;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-selectable-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.card-selectable-item.selected {
  box-shadow: 0 0 0 2px var(--card-color, #1a237e),
    0 4px 16px rgba(0, 0, 0, 0.2);
}

.card-content {
  position: relative;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.card-logo {
  position: absolute;
  top: 16px;
  right: 16px;
  opacity: 0.9;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-main-info {
  margin-bottom: 8px;
}

.card-number {
  font-size: 14px;
  font-family: "Courier New", monospace;
  letter-spacing: 1px;
  font-weight: 500;
  margin-bottom: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.card-holder {
  display: flex;
  flex-direction: column;
}

.card-secondary-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-expiry {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 9px;
  opacity: 0.8;
  margin-bottom: 2px;
}

.value {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.card-favorite-badge {
  position: absolute;
  top: 12px;
  left: 12px;
}

.card-selected-check {
  position: absolute;
  bottom: 10px;
  right: 12px;
}

.cards-list-container {
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
}

.payment-table-container {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 250px;
}

.payment-table-header {
  flex-shrink: 0;
}

.payment-table-body {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.payment-table-footer {
  border-top: 2px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.payment-table {
  width: 100%;
  background: transparent !important;
  border-collapse: collapse;
}

.payment-table th,
.payment-table td {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.payment-table-footer tfoot {
  display: table-footer-group;
}

.total-row td {
  padding: 16px !important;
  border-bottom: none !important;
}

.payment-table-body::-webkit-scrollbar {
  width: 8px;
}

.payment-table-body::-webkit-scrollbar-track {
  border-radius: 4px;
}

.payment-table-body::-webkit-scrollbar-thumb {
  border-radius: 4px;
}
</style>