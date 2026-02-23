<template>
  <v-row justify="center">
    <v-col cols="12" md="4" class="mt-11">
      <v-card
        elevation="24"
        class="py-4 px-4"
        :loading="isLoading"
        :disabled="isLoading"
      >
        <v-card-text class="text-center">
          <v-row dense>
            <v-col cols="6" class="text-left" style="height: 40px">
              <BtnBack :route="{ name: 'login' }" />
            </v-col>

            <v-col cols="6" class="text-right" style="height: 40px">
              <BtnTheme size="x-small" />
            </v-col>

            <v-col cols="12">
              <Logo width="50%" />
            </v-col>

            <v-col cols="12">
              <v-form
                v-if="!success"
                ref="formRef"
                @submit.prevent="handleAction"
              >
                <v-row dense>
                  <v-col cols="12" class="text-left">
                    <v-text-field
                      v-model="item.email"
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

                  <v-col cols="12" class="pt-2">
                    <v-btn
                      block
                      color="info"
                      type="submit"
                      class="text-none"
                      :loading="isLoading"
                    >
                      Recuperar contraseña
                      <v-icon end>mdi-email-fast</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>

              <v-row v-else dense>
                <v-col cols="12" class="pt-2">
                  <v-icon size="32" color="info">mdi-email-fast</v-icon>
                </v-col>

                <v-col cols="12">
                  <div class="text-body-2">
                    Hemos enviado un correo a
                    <br />
                    <b>{{ item.email }}</b>
                    <br />
                    con instrucciones para restablecer tu contraseña.
                  </div>

                  <div class="text-caption text-medium-emphasis mt-3">
                    Cuentas con 5 min. para realizar esta acción.
                  </div>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" class="pt-2">
              <Version />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, inject } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import { URL_API } from "@/utils/config";
import { getHdrs, getErr } from "@/utils/http";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";

import BtnBack from "@/components/BtnBack.vue";
import Logo from "@/components/Logo.vue";
import BtnTheme from "@/components/BtnTheme.vue";
import Version from "@/components/Version.vue";

const alert = inject("alert");
const route = useRoute();

const isLoading = ref(false);
const formRef = ref(null);
const item = ref({ email: route.query.email || null });
const success = ref(false);
const rules = getRules();

const handleAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  isLoading.value = true;
  const payload = getObj(item.value, true);

  try {
    const endpoint = `${URL_API}/public/users/password/recover`;
    await axios.post(endpoint, payload, getHdrs());
    success.value = true;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};
</script>
