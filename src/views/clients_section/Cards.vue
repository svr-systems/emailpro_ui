<template>
  <v-card elevation="24" :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10" class="py-4">
          <CardTitle :text="$route.meta.title" :icon="$route.meta.icon" />
        </v-col>
        <v-col cols="2" class="text-right py-4">
          <v-btn
            icon
            variant="flat"
            size="x-small"
            color="success"
            v-if="!isLoading"
            @click="openAddCardDialog"
          >
            <v-icon>mdi-plus</v-icon>
            <v-tooltip activator="parent" location="bottom"
              >Agregar tarjeta</v-tooltip
            >
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <div
        v-if="!isLoading && (!item || item.length === 0)"
        class="text-center py-8"
      >
        <v-icon size="60" color="grey-lighten-1" class="mb-4">
          mdi-credit-card-off
        </v-icon>
        <div class="text-h6 text-grey">No hay tarjetas registradas</div>
        <div class="text-body-2 text-grey mt-2">
          Agrega una tarjeta para realizar pagos más rápido
        </div>
      </div>

      <div v-if="!isLoading && item && item.length > 0" class="cards-container">
        <v-row dense>
          <v-col v-for="card in item" :key="card.id" cols="12" sm="6" md="3">
            <div class="card-item" :style="getCardStyle(card)">
              <div class="card-content">
                <div class="card-logo">
                  <v-img
                    :src="getBrandLogo(card.brand)"
                    width="50"
                    height="35"
                    contain
                  />
                </div>

                <div class="card-info">
                  <div class="card-main-info">
                    <div class="card-number">
                      {{ card.card_number }}
                    </div>
                    <div class="card-holder">
                      <div class="label">Titular</div>
                      <div class="value">{{ card.holder_name }}</div>
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

                <div class="card-actions">
                  <v-btn
                    icon
                    size="x-small"
                    :color="card.is_favorite ? 'amber' : 'white'"
                    variant="text"
                    :loading="isSettingFavorite === card.id"
                    @click.stop="setFavoriteCard(card.id, card)"
                  >
                    <v-icon>
                      {{ card.is_favorite ? "mdi-star" : "mdi-star-outline" }}
                    </v-icon>
                    <v-tooltip activator="parent" location="top">
                      {{
                        card.is_favorite
                          ? "Principal"
                          : "Establecer como principal"
                      }}
                    </v-tooltip>
                  </v-btn>

                  <v-btn
                    icon
                    size="x-small"
                    color="error"
                    variant="text"
                    :loading="isEliminating === card.id"
                    @click.stop="deleteCard(card.id, card)"
                  >
                    <v-icon>mdi-delete</v-icon>
                    <v-tooltip activator="parent" location="top"
                      >Eliminar</v-tooltip
                    >
                  </v-btn>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card-text>

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
                <v-tooltip activator="parent" location="left">
                  Cerrar
                </v-tooltip>
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
  </v-card>
</template>

<script setup>
// Importaciones de librerías externas
import { ref, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

// Importaciones internas del proyecto
import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";

// Estado y referencias
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

// Estado reactivo
const isLoading = ref(false);
const item = ref([]);
const addCardDialog = ref(false);
const isAddingCard = ref(false);
const addCardFormRef = ref(null);
const rules = getRules();
const showCvv = ref(false);
const isSettingFavorite = ref(null);
const isEliminating = ref(null);

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

// Lista de meses (01-12) - Solo números
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

// Lista de años - Solo últimos 2 dígitos (30, 31, etc.)
const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const maxYears = 10; // Máximo de años de validez para tarjetas
  const yearsList = [];

  for (let i = 0; i <= maxYears; i++) {
    const year = currentYear + i;
    const shortYear = (year % 100).toString().padStart(2, "0");

    yearsList.push({
      title: shortYear, // Muestra: "30"
      value: shortYear, // Valor para validaciones y envío: "30"
      fullYear: year.toString(), // Para validaciones internas
    });
  }

  return yearsList;
});

const cardNumberMaxLength = computed(() => {
  if (cardBrand.value === "amex") return 15;
  return 16;
});

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

// Reglas de validación actualizadas
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

    // Convertir año corto a año completo para validación
    const selectedYearShort = parseInt(newCard.value.expirationYear);
    const selectedMonth = parseInt(newCard.value.expirationMonth);

    // Encontrar el año completo correspondiente
    const selectedYearObj = years.value.find(
      (year) => parseInt(year.value) === selectedYearShort
    );

    // Si no se encuentra, usar año corto como base
    const selectedYearFull = selectedYearObj
      ? parseInt(selectedYearObj.fullYear)
      : currentYear - (currentYear % 100) + selectedYearShort;

    // Validación de año seleccionado
    if (!selectedYearFull || selectedYearFull < currentYear) {
      return "Selecciona un año válido";
    }

    // Si el año es el actual, validar que el mes no sea pasado
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

const formatExpiry = (month, year) => {
  const formattedMonth = month?.toString().padStart(2, "0") || "01";
  const formattedYear = year?.toString().padStart(2, "0") || "00";
  return `${formattedMonth}/${formattedYear}`;
};

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

const setFavoriteCard = async (cardId, card) => {
  try {
    isSettingFavorite.value = cardId;

    const payload = {
      user_card_id: cardId,
    };

    const endpoint = `${URL_API}/client/cards/favorite`;
    await axios.post(endpoint, payload, getHdrs(store.getAuth?.token));

    await getItem();

    alert?.show("success", "Tarjeta establecida como principal");
  } catch (err) {
    alert?.show(
      "red-darken-1",
      getErr(err) || "Error al establecer tarjeta principal"
    );
  } finally {
    isSettingFavorite.value = null;
  }
};

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
    isDefault: item.value.length === 0,
  };
  cardBrand.value = "";
  cardBrandIcon.value = "";
  cardBrandName.value = "";
  showCvv.value = false;

  addCardDialog.value = true;
};

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

  // Validación adicional para la fecha
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentYearShort = currentYear % 100;

  const selectedYearShort = parseInt(newCard.value.expirationYear);
  const selectedMonth = parseInt(newCard.value.expirationMonth);

  // Encontrar el año completo correspondiente
  const selectedYearObj = years.value.find(
    (year) => parseInt(year.value) === selectedYearShort
  );

  // Si no se encuentra, convertir año corto a año completo
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
      expiration_year: newCard.value.expirationYear, // Ya está en formato corto "30"
      is_favorite: newCard.value.isDefault ? 1 : 0,
    };

    const endpoint = `${URL_API}/client/cards`;
    await axios.post(endpoint, payload, getHdrs(store.getAuth?.token));
    addCardDialog.value = false;

    await getItem();

    alert?.show("success", "Tarjeta agregada exitosamente");
  } catch (err) {
    alert?.show("red-darken-1", getErr(err) || "Error al guardar la tarjeta");
  } finally {
    isAddingCard.value = false;
  }
};

const deleteCard = async (cardId, card) => {
  const confirmed = await confirm?.show(
    `¿Estás seguro de eliminar la tarjeta terminada en ${card.card_number?.slice(
      -4
    )}?`
  );
  if (!confirmed) return;

  try {
    isEliminating.value = cardId;

    const endpoint = `${URL_API}/client/cards/${cardId}`;
    await axios.delete(endpoint, getHdrs(store.getAuth?.token));

    await getItem();

    alert?.show("success", "Tarjeta eliminada exitosamente");
  } catch (err) {
    alert?.show("red-darken-1", getErr(err) || "Error al eliminar la tarjeta");
  } finally {
    isEliminating.value = null;
  }
};

const getItem = async () => {
  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/client/cards`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    item.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
    item.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Inicialización
onMounted(() => {
  getItem();
});
</script>

<style scoped>
.cards-container {
  margin-top: 16px;
}

.card-item {
  width: 100%;
  height: 160px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  background: linear-gradient(135deg, var(--card-color, #1a237e), #3949ab);
  color: white;
  position: relative;
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
  font-size: 16px;
  font-family: "Courier New", monospace;
  letter-spacing: 1.5px;
  font-weight: 500;
  margin-bottom: 8px;
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
  font-size: 10px;
  opacity: 0.8;
  margin-bottom: 2px;
}

.value {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.card-chip {
  position: absolute;
  bottom: 16px;
  left: 16px;
}

.card-actions {
  position: absolute;
  bottom: 16px;
  right: 16px;
}

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
</style>