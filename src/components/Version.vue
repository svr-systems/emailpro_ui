<template>
  <div class="text-caption font-weight-thin text-disabled">
    <div>Solmetec © {{ getCurrentYear() }}</div>
    <div>
      <small>{{ getApi(BASE_URL) }} | v{{ APP_VERSION }}</small>
    </div>
  </div>
</template>

<script setup>
import { APP_VERSION, BASE_URL } from "@/utils/config";
import { getApi } from "@/utils/http";
import { getCurrentYear } from "@/utils/helpers";
</script>
