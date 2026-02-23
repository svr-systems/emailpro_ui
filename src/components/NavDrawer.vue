<template>
  <v-navigation-drawer
    v-model="drawerModel"
    :permanent="!isMobile"
    :temporary="isMobile"
    :expand-on-hover="!isMobile"
    :rail="!isMobile"
  >
    <v-list nav>
      <v-list-item
        v-for="item in visibleMenu"
        :key="item.link"
        :to="{ name: item.link }"
      >
        <template #prepend>
          <v-icon :icon="item.icon" />
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from "vue";
import { menuItems } from "@/utils/menu";
import { useAccess } from "@/utils/access";

const { filterMenuItemsByAccess } = useAccess();

const props = defineProps({ modelValue: Boolean, isMobile: Boolean });
const emit = defineEmits(["update:modelValue"]);

const drawerModel = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const visibleMenu = computed(() => filterMenuItemsByAccess(menuItems));
</script>
