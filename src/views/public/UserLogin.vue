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
            <v-col cols="12" class="text-right" style="height: 40px">
              <BtnTheme size="x-small" />
            </v-col>

            <v-col cols="12">
              <Logo width="50%" />
            </v-col>

            <v-col cols="12">
              <v-form ref="formRef" @submit.prevent="loginAction">
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
                      hide-details
                    />
                  </v-col>

                  <v-col cols="12" class="text-left">
                    <InpPassword
                      v-model="item.password"
                      label="Contraseña"
                      counter
                      :rules="rules.required"
                      autocomplete="current-password"
                      hide-details
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-btn
                      variant="plain"
                      size="x-small"
                      class="text-none"
                      :to="{
                        name: 'user_password_recover',
                        query: { email: item.email },
                      }"
                    >
                      ¿Olvidaste tu contraseña?
                    </v-btn>
                  </v-col>

                  <v-col cols="12" class="pt-2">
                    <v-btn
                      block
                      color="info"
                      type="submit"
                      class="text-none"
                      :loading="isLoading"
                    >
                      Iniciar sesión
                      <v-icon end>mdi-login</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
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
import { ref, inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getObj } from "@/utils/helpers";
import { getRules } from "@/utils/validators";

import Logo from "@/components/Logo.vue";
import InpPassword from "@/components/InpPassword.vue";
import BtnTheme from "@/components/BtnTheme.vue";
import Version from "@/components/Version.vue";

const alert = inject("alert");
const router = useRouter();
const store = useStore();

const isLoading = ref(false);
const formRef = ref(null);
const item = ref({ email: "", password: "" });
const rules = getRules();

const loginAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  isLoading.value = true;
  const payload = getObj(item.value, true);

  try {
    const endpoint = `${URL_API}/login`;
    const response = await axios.post(endpoint, payload, getHdrs());

    const auth = getRsp(response).data.auth;
    await store.loginAction(auth);

    await router.replace({
      name: "home",
    });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const auth = store.getAuth ?? store.auth;
  if (auth?.token) {
    router.replace({ name: "home" });
  }
});
</script>
