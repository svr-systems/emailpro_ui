<template>
  <v-row justify="center">
    <v-col cols="12" md="7" class="mt-11">
      <v-card
        elevation="24"
        class="py-4 px-4"
        :loading="isLoading"
        :disabled="isLoading"
      >
        <v-card-text>
          <v-row dense>
            <v-col cols="6" style="height: 40px">
              <BtnBack :route="{ name: 'login' }" />
            </v-col>

            <v-col cols="6" class="text-right" style="height: 40px">
              <BtnTheme size="x-small" />
            </v-col>

            <v-col cols="12" class="text-center">
              <Logo height="78" />
            </v-col>

            <v-col cols="12" v-if="item">
              <v-form
                v-if="!success"
                ref="formRef"
                @submit.prevent="doctorStore"
              >
                <v-row dense>
                  <v-col cols="12">
                    <div class="text-subtitle-2 text-center mb-1">
                      Datos personales
                    </div>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model.trim="item.user.name"
                      label="Nombre"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="given-name"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.trim="item.user.paternal_surname"
                      label="Apellido paterno"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="25"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="family-name"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.trim="item.user.maternal_surname"
                      label="Apellido materno"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="25"
                      counter
                      :rules="rules.textOptional"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model.trim="item.user.curp"
                      label="CURP"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="18"
                      counter
                      :rules="rules.curpRequired"
                      autocomplete="off"
                    />
                  </v-col>

                  <v-col cols="12">
                    <div class="text-subtitle-2 text-center my-1">Contacto</div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.trim="item.user.phone"
                      label="Teléfono"
                      type="tel"
                      variant="outlined"
                      density="compact"
                      maxlength="10"
                      counter
                      :rules="rules.phoneRequired"
                      autocomplete="tel"
                      inputmode="numeric"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model.trim="item.user.email"
                      label="Correo"
                      type="email"
                      variant="outlined"
                      density="compact"
                      maxlength="65"
                      counter
                      clearable
                      :rules="rules.emailRequired"
                      autocomplete="username"
                      inputmode="email"
                      autocapitalize="none"
                      spellcheck="false"
                    />
                  </v-col>

                  <v-col cols="12">
                    <div class="text-subtitle-2 text-center my-1">
                      Especialidad(es)
                    </div>
                  </v-col>

                  <v-col
                    cols="12"
                    v-for="(doctor_specialty, i) in item.doctor_specialties"
                    :key="i"
                  >
                    <v-row dense>
                      <v-col cols="12" class="d-flex align-center pt-0 pb-0">
                        <v-spacer />
                        <v-btn
                          v-if="i !== 0"
                          type="button"
                          icon
                          variant="plain"
                          size="x-small"
                          color="error"
                          @click="specialtiesRemove(i)"
                        >
                          <v-icon>mdi-close</v-icon>
                          <v-tooltip activator="parent" location="top">
                            Quitar especialidad
                          </v-tooltip>
                        </v-btn>
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-select
                          v-model="doctor_specialty.specialty_id"
                          :label="`Especialidad (${i + 1})`"
                          :items="specialties"
                          :loading="specialtiesLoading"
                          item-value="id"
                          item-title="name"
                          variant="outlined"
                          density="compact"
                          :rules="rules.required"
                        />
                      </v-col>

                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.trim="doctor_specialty.license"
                          label="Número de cédula"
                          type="text"
                          variant="outlined"
                          density="compact"
                          maxlength="30"
                          counter
                          :rules="rules.textRequired"
                          autocomplete="off"
                        />
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="12" class="text-center">
                    <v-btn
                      v-if="item.doctor_specialties.length < MAX_SPECIALTIES"
                      type="button"
                      variant="plain"
                      size="x-small"
                      class="text-none"
                      @click="specialtiesAdd"
                    >
                      Agregar otra especialidad
                    </v-btn>

                    <div v-else class="text-caption text-medium-emphasis mt-1">
                      Máximo {{ MAX_SPECIALTIES }} especialidades.
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
                      Crear cuenta de médico
                      <v-icon end>mdi-account-check</v-icon>
                    </v-btn>

                    <div
                      class="text-caption text-medium-emphasis mt-2 text-center"
                    >
                      Tu cuenta será revisada antes de habilitar el registro de
                      consultas.
                    </div>
                  </v-col>
                </v-row>
              </v-form>

              <v-row v-else dense class="text-center">
                <v-col cols="12" class="pt-2">
                  <v-icon size="36" color="success">mdi-check-circle</v-icon>
                </v-col>

                <v-col cols="12">
                  <div class="text-body-2">
                    Tu registro fue enviado correctamente.
                    <br />
                    Revisa tu correo para confirmar tu cuenta y establecer tu
                    contraseña.
                  </div>

                  <div class="text-caption text-medium-emphasis mt-2">
                    Tus datos serán validados y te contactaremos para corroborar
                    la información.
                  </div>
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

import { URL_API, IS_LOCAL } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getRules } from "@/utils/validators";
import { getUserObj } from "@/utils/objects";

import BtnBack from "@/components/BtnBack.vue";
import BtnTheme from "@/components/BtnTheme.vue";
import Logo from "@/components/Logo.vue";
import Version from "@/components/Version.vue";

const alert = inject("alert");
const confirm = inject("confirm");
const route = useRoute();

const MAX_SPECIALTIES = 3;

const isLoading = ref(false);
const formRef = ref(null);
const item = ref(null);
const success = ref(false);
const rules = getRules();

const specialties = ref([]);
const specialtiesLoading = ref(true);

const getCatalogs = async () => {
  try {
    const endpoint = `${URL_API}/public/catalogs/specialties`;
    const response = await axios.get(endpoint, {
      params: { is_active: 1 },
      ...getHdrs(),
    });

    specialties.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    specialtiesLoading.value = false;
  }
};

const getItem = () => {
  item.value = {
    user: getUserObj(),
    hospital: {
      subdomain: IS_LOCAL ? "dev" : null,
    },
    doctor_specialties: [],
  };

  specialtiesAdd();
};

const specialtiesAdd = () => {
  item.value.doctor_specialties.push({
    specialty_id: null,
    license: "",
  });
};

const specialtiesRemove = (i) => {
  item.value.doctor_specialties.splice(i, 1);
};

const doctorStore = async () => {
  if (!formRef.value) return;

  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show(
    "¿Confirma que la información ingresada es correcta?"
  );
  if (!confirmed) return;

  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/public/doctors`;
    const response = getRsp(await axios.post(endpoint, item.value, getHdrs()));

    alert?.show("success", response.msg);
    success.value = true;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getCatalogs();
  getItem();
});
</script>
