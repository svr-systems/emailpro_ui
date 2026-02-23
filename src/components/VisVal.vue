<template>
  <div>
    <div v-if="label" class="font-weight-light text-caption text-medium-emphasis">
      {{ label }}
    </div>
    <div class="text-body-2">
      <span v-if="!bool">
        {{ value != null && value !== "" ? value : "-" }}
      </span>
      <v-icon v-else small :color="value ? 'info' : ''">
        mdi-checkbox-blank-circle{{ value ? "" : "-outline" }}
      </v-icon>
    </div>
    <div v-if="subvalue" class="text-caption">
      <small>{{ subvalue }}</small>
    </div>
  </div>
</template>

<script setup>
// Props
defineProps({
  label: String,
  value: [String, Number, Boolean],
  subvalue: String,
  bool: { type: Boolean, default: false },
});
</script>
