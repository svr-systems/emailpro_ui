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
              <v-row dense v-if="paid" class="text-center py-8">
                <v-col cols="12">
                  <v-icon size="50" color="success" class="mb-4">
                    mdi-check-circle
                  </v-icon>

                  <div class="text-body-1">
                    El pago de esta consulta ya ha sido realizado.
                  </div>
                  <div class="text-body-2 mt-1">
                    Revise su correo electrónico.
                  </div>
                </v-col>
              </v-row>

              <v-row dense v-else-if="showPayment" class="text-center py-8">
                <v-col cols="12">
                  <v-icon size="50" color="success" class="mb-4">
                    mdi-check-circle
                  </v-icon>

                  <div class="text-body-1">Pago realizado con éxito.</div>
                  <div class="text-body-2 mt-1">
                    Recibirás un comprobante en tu correo electrónico.
                  </div>
                </v-col>
              </v-row>

              <v-row dense v-else-if="item && consultation">
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

                <v-col cols="12">
                  <div class="text-disabled text-center mb-1">
                    Información de pago
                  </div>
                </v-col>

                <v-col cols="12">
                  <v-form
                    ref="formRef"
                    validate-on="submit lazy"
                    @submit.prevent="handleAction"
                  >
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="cardNumber"
                          label="Número de tarjeta"
                          type="text"
                          variant="outlined"
                          density="compact"
                          :counter="cardNumberMaxLength"
                          :maxlength="cardNumberMaxLength + 3"
                          :rules="[...rules.textRequired, cardRules.cardNumber]"
                          :hint="
                            cardBrandName ? `Tarjeta ${cardBrandName}` : ''
                          "
                          persistent-hint
                          prepend-inner-icon="mdi-credit-card"
                          hide-details="auto"
                          @input="formatCardNumber"
                          @blur="detectCardBrand"
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
                          v-model.trim="cardHolder"
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
                        <v-text-field
                          v-model="cardExpiry"
                          label="MM/AA"
                          type="text"
                          variant="outlined"
                          density="compact"
                          maxlength="5"
                          :rules="[...rules.textRequired, cardRules.cardExpiry]"
                          placeholder="MM/AA"
                          prepend-inner-icon="mdi-calendar"
                          hide-details="auto"
                          autocomplete="cc-exp"
                          inputmode="numeric"
                          @input="formatExpiry"
                        />
                      </v-col>

                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model="cardCvv"
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
                              :aria-label="
                                showCvv ? 'Ocultar CVV' : 'Mostrar CVV'
                              "
                              @click.stop="showCvv = !showCvv"
                            >
                              <v-icon size="18">
                                {{ showCvv ? "mdi-eye-off" : "mdi-eye" }}
                              </v-icon>
                            </v-btn>
                          </template>
                        </v-text-field>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-alert type="info" variant="tonal" density="compact">
                          <div class="text-caption">
                            No almacenamos los datos de tu tarjeta.
                          </div>
                        </v-alert>
                      </v-col>

                      <v-col cols="12" class="text-center pt-5">
                        <div class="text-disabled text-center mb-1">Total</div>
                        <div class="text-h4 font-weight-light">
                          {{ getAmountFormat(consultation?.charge_amount) }}
                        </div>
                      </v-col>

                      <v-col cols="12" class="pt-2">
                        <v-btn
                          block
                          color="success"
                          type="submit"
                          class="text-none"
                          :loading="isLoading"
                        >
                          Pagar
                          <v-icon end>mdi-lock-check</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
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
// Libraries
import { ref, inject, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

// Utils
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";
import { getAmountFormat } from "@/utils/formatters";

// Components
import BtnTheme from "@/components/BtnTheme.vue";
import Logo from "@/components/Logo.vue";
import Version from "@/components/Version.vue";
import VisVal from "@/components/VisVal.vue";

const alert = inject("alert");
const route = useRoute();

const itemId = route.params.id;

const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);
const consultation = ref(null);
const rules = getRules();

const showPayment = ref(false);
const paid = ref(false);

// Payment form
const cardNumber = ref("");
const cardHolder = ref("");
const cardExpiry = ref("");
const cardCvv = ref("");
const showCvv = ref(false);

const cardBrand = ref("");
const cardBrandIcon = ref("");
const cardBrandName = ref("");

const isOpenPayReady = ref(false);
const deviceSessionId = ref("");
const tokenId = ref(null);

const openpayConfig = {
  id: "mvqklc5fv1rsuqrttndt",
  apikey: "pk_53706e08f72e45c585a55809e81636df",
};

const cardNumberMaxLength = computed(() => {
  if (cardBrand.value === "amex") return 15;
  return 16;
});

const detectCardBrand = () => {
  const num = cardNumber.value.replace(/\s/g, "");

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

const formatCardNumber = () => {
  let num = cardNumber.value.replace(/\s/g, "").replace(/\D+/g, "");

  if (cardBrand.value === "amex") {
    num = num.replace(/(\d{4})(\d{6})(\d{0,5})/, "$1 $2 $3").trim();
  } else {
    num = num.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  }

  cardNumber.value = num.substring(0, cardNumberMaxLength.value + 3);
  detectCardBrand();
};

const formatExpiry = () => {
  let expiry = cardExpiry.value.replace(/\D/g, "");

  if (expiry.length >= 2) {
    expiry = expiry.substring(0, 2) + "/" + expiry.substring(2, 4);
  }

  cardExpiry.value = expiry.substring(0, 5);
};

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

  cardExpiry: (value) => {
    if (!value || !value.includes("/")) return "Formato MM/AA requerido";

    const [month, year] = value.split("/").map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (month < 1 || month > 12) return "Mes inválido";
    if (year < currentYear) return "Tarjeta expirada";
    if (year === currentYear && month < currentMonth) return "Tarjeta expirada";

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

const getItem = async () => {
  try {
    const endpoint = `${URL_API}/public/user_fiscal_data/${itemId}`;
    const response = await axios.get(endpoint, getHdrs());

    item.value = { ...getRsp(response).data.item };
    consultation.value = { ...getRsp(response).data.item.consultation };
    paid.value = !!consultation.value?.is_paid;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
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

const createOpenPayToken = () => {
  return new Promise((resolve, reject) => {
    if (!isOpenPayReady.value) {
      reject(new Error("OpenPay no está inicializado"));
      return;
    }

    const [month, year] = cardExpiry.value.split("/").map(Number);

    const cardData = {
      card_number: cardNumber.value.split(" ").join(""),
      holder_name: cardHolder.value,
      expiration_year: year?.toString() || "",
      expiration_month: (month || "").toString().padStart(2, "0"),
      cvv2: cardCvv.value,
    };

    OpenPay.token.create(
      cardData,
      (response) => {
        tokenId.value = response?.data?.id || null;
        resolve(tokenId.value);
      },
      (error) => {
        reject(
          new Error(error?.data?.description || "Error al procesar la tarjeta")
        );
      }
    );
  });
};

const handleAction = async () => {
  if (!formRef.value) return;

  const { valid } = await formRef.value.validate();
  if (!valid) return;

  isLoading.value = true;

  try {
    const token = await createOpenPayToken();

    const payload = getObj(
      {
        consultation_id: itemId,
        name: cardHolder.value,
        last_name: "Prueba",
        token_id: token,
        device_session_id: deviceSessionId.value,
        use_card_points: null,
      },
      true
    );

    const endpoint = `${URL_API}/public/consultation/payment/card`;
    await axios.post(endpoint, payload, getHdrs());

    showPayment.value = true;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  setTimeout(() => {
    getItem();
    initializeOpenPay();
  }, 2500);
});
</script>
