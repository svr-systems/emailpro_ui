<template>
  <span
    :class="['font-weight-light', sub ? 'text-caption' : 'text-subtitle-1']"
  >
    <v-icon
      v-if="icon"
      :icon="icon"
      :size="sub ? 'x-small' : 'small'"
      class="ml-1"
    />
    {{ text }}
  </span>
</template>

<script setup>
// Props
defineProps({
  text: {
    type: String,
    required: true,
  },
  icon: String,
  sub: Boolean,
});
</script>
