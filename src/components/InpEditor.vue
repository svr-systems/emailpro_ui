<template>
   <div class="mb-4">
     <div
       class="mb-1 text-caption font-weight-light text-medium-emphasis"
     >
       Indicaciones
     </div>
     <div
       v-if="editor"
       class="editor-container"
       :class="{
         'editor-error-border': hasError,
         'editor-default-border': !hasError,
       }"
     >
    <v-toolbar density="compact" rounded="t-md" border>
      <div class="d-flex ga-2 pa-2 flex-wrap toolbar-buttons">
        <v-btn
          rounded="lg"
          size="32"
          icon
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
          :disabled="!editor.can().chain().focus().toggleBold().run()"
        >
          <v-icon>mdi-format-bold</v-icon>
        </v-btn>

        <v-btn
          rounded="lg"
          size="32"
          icon
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
          :disabled="!editor.can().chain().focus().toggleItalic().run()"
        >
          <v-icon>mdi-format-italic</v-icon>
        </v-btn>

        <v-btn
          rounded="lg"
          size="32"
          icon
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="editor.chain().focus().toggleStrike().run()"
          :disabled="!editor.can().chain().focus().toggleStrike().run()"
        >
          <v-icon>mdi-format-strikethrough</v-icon>
        </v-btn>

        <v-divider class="mx-1" vertical></v-divider>

        <v-btn
          v-for="level in 3"
          :key="level"
          rounded="lg"
          size="32"
          icon
          :class="{ 'is-active': editor.isActive('heading', { level }) }"
          @click="editor.chain().focus().toggleHeading({ level }).run()"
        >
          <v-icon>{{ `mdi-format-header-${level}` }}</v-icon>
        </v-btn>

        <v-divider class="mx-1" vertical></v-divider>

        <v-btn
          rounded="lg"
          size="32"
          icon
          :class="{ 'is-active': editor.isActive('bulletList') }"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>

        <v-btn
          rounded="lg"
          size="32"
          icon
          :class="{ 'is-active': editor.isActive('orderedList') }"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <v-icon>mdi-format-list-numbered</v-icon>
        </v-btn>

        <v-btn
          rounded="lg"
          size="32"
          icon
          :class="{ 'is-active': editor.isActive('blockquote') }"
          @click="editor.chain().focus().toggleBlockquote().run()"
        >
          <v-icon>mdi-format-quote-close</v-icon>
        </v-btn>

        <v-divider class="mx-1" vertical></v-divider>

        <v-btn
          rounded="lg"
          size="32"
          icon
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().undo()"
        >
          <v-icon>mdi-undo</v-icon>
        </v-btn>
        <v-btn
          rounded="lg"
          size="32"
          icon
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().redo()"
        >
          <v-icon>mdi-redo</v-icon>
        </v-btn>
      </div>
    </v-toolbar>

    <editor-content
      :editor="editor"
      :class="[
        ['pa-4'],
        ['tiptap-content'],
        [store.conf.theme_dark ? 'bg-grey-darken-4' : ''],
        ['border border-grey-lighten-1']
      ]"
    />
    </div>
    <div
      v-if="hasError"
      class="text-error text-caption mt-2 ms-4"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { onBeforeUnmount, watch, ref } from "vue";

import { useStore } from "@/store";

const store = useStore();

const props = defineProps({
   modelValue: {
     type: String,
     default: "",
   },
   rules: {
     type: Array,
     default: () => [],
   },
});

const emit = defineEmits(["update:modelValue"]);

const hasError = ref(false);
const errorMessage = ref("");

const validate = () => {
  if (!props.rules.length) return true;

  const value = props.modelValue || "";
  const cleanValue = value.replace(/<p><\/p>|<p><br><\/p>|<div><\/div>/g, "").trim();
  const isEmpty = cleanValue === "";

  for (const rule of props.rules) {
    const result = rule(isEmpty ? "" : cleanValue);
    if (result !== true) {
      hasError.value = true;
      errorMessage.value = result;
      return false;
    }
  }

  hasError.value = false;
  errorMessage.value = "";
  return true;
};

const editor = useEditor({
  extensions: [StarterKit],
  content: props.modelValue || "",
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
    if (props.rules.length) {
      validate();
    }
  },
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (!editor.value) return;

    const currentHtml = editor.value.getHTML();

    // Comprobar si el contenido es idéntico para evitar bucles o movimientos innecesarios
    if (newValue !== currentHtml) {
      // setContent para reemplazar el contenido con HTML, false para evitar un bucle de actualización
      editor.value.commands.setContent(newValue || "", false);
      if (props.rules.length) {
        validate();
      }
    }
  },
  { immediate: true }
);
defineExpose({
  validate,
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<style scoped>
/* Botones activos de Vuetify */
.toolbar-buttons .v-btn.is-active {
  background-color: rgb(var(--v-theme-primary));
  color: white;
}

/* Estilos para el contenedor del editor (simula el borde del campo) */
.editor-container {
  width: 100%;
  border-radius: 5px;
}

/* Estilo del borde en estado de error (simula el borde rojo) */
.editor-error-border {
  border: 2px solid rgb(var(--v-theme-error)) !important;
}

.tiptap-content :deep(.ProseMirror) {
  min-height: 200px;
  outline: none;
  line-height: 1.5;
}

/* Estilo blockquote */
.tiptap-content :deep(blockquote) {
  border-left: 4px solid #007bff;
  padding-left: 1rem;
  margin: 1em 0;
  color: #6c757d;
}
</style>
