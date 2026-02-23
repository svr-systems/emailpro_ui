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

            <v-col v-if="!item" cols="12">
              <p v-if="isLoading" class="py-2">Validando información</p>
              <div v-else>
                <v-icon size="48" color="warning">mdi-alert-circle</v-icon>
                <p class="py-2">
                  La cuenta ya está confirmada y/o la acción no es procesable
                </p>
              </div>
            </v-col>

            <v-col v-else cols="12">
              <v-form
                v-if="!success"
                ref="formRef"
                @submit.prevent="handleAction"
              >
                <v-row dense>
                  <v-col cols="12">
                    <VisVal label="Correo" :value="item.email" />
                  </v-col>

                  <v-col cols="12" class="text-left">
                    <InpPassword
                      v-model="item.password"
                      label="Contraseña"
                      counter
                      :rules="rules.passwordRequired"
                      autocomplete="off"
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
                      Confirmar cuenta
                      <v-icon end>mdi-account-check</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>

              <v-row v-else dense>
                <v-col cols="12" class="pt-2">
                  <v-icon size="32" color="success">mdi-check-circle</v-icon>
                </v-col>

                <v-col cols="12">
                  <div class="text-body-2">
                    Tu cuenta ha sido confirmada correctamente.
                  </div>

                  <div class="text-caption text-medium-emphasis mt-3">
                    Serás redireccionado en breve.
                  </div>

                  <div>
                    <v-progress-circular size="16" indeterminate />
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
import { ref, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";

import Logo from "@/components/Logo.vue";
import VisVal from "@/components/VisVal.vue";
import InpPassword from "@/components/InpPassword.vue";
import BtnTheme from "@/components/BtnTheme.vue";
import Version from "@/components/Version.vue";

const store = useStore();
const alert = inject("alert");
const router = useRouter();
const route = useRoute();

const itemId = route.params.id;
const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);
const success = ref(false);
const rules = getRules();

const getItem = async () => {
  try {
    const url = `${URL_API}/public/users/account_confirm/${itemId}`;
    const response = await axios.get(url, getHdrs());
    item.value = { ...getRsp(response).data.item, password: null };
  } catch (err) {
    getErr(err);
  } finally {
    isLoading.value = false;
  }
};

const handleAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  isLoading.value = true;
  const payload = getObj(item.value, true);

  try {
    let endpoint = `${URL_API}/public/users/account_confirm/${itemId}`;
    await axios.post(endpoint, payload, getHdrs());
    success.value = true;

    setTimeout(async () => {
      try {
        endpoint = `${URL_API}/login`;
        const response = await axios.post(endpoint, payload, getHdrs());
        await store.loginAction(getRsp(response).data.auth);
        await router.push({ name: "home" });
      } catch (err) {
        alert?.show("red-darken-1", getErr(err));
      }
    }, 5000);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  setTimeout(() => getItem(), 2500);
});
</script>
