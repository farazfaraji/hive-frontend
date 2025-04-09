<template>
  <v-dialog v-model="dialog" max-width="500px">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props" prepend-icon="mdi-plus" variant="tonal" class="mb-4">
        Add New Word
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 pa-4">Add New Word</v-card-title>

      <v-card-text class="pa-4">
        <v-form @submit.prevent="handleSubmit" ref="form">
          <v-text-field
            v-model="newWord"
            label="Enter new word or phrase"
            :rules="[(v) => !!v || 'Word is required']"
            required
            autofocus
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" @click="dialog = false"> Cancel </v-btn>
        <v-btn color="primary" variant="tonal" :loading="loading" @click="handleSubmit">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { WordService } from '@/api/services/word.service'
import { useSnackbar } from '@/composables/useSnackbar'

const dialog = ref(false)
const newWord = ref('')
const loading = ref(false)
const form = ref<HTMLFormElement | null>(null)
const { snackbar, showSnackbar } = useSnackbar()

const handleSubmit = async () => {
  if (!form.value?.validate()) return

  try {
    loading.value = true
    await WordService.addWord(newWord.value)
    showSnackbar('Word added successfully!', 'success')
    dialog.value = false
    newWord.value = ''
    // Emit event to refresh the word list
    emit('word-added')
  } catch (error) {
    console.error('Error adding word:', error)
    showSnackbar('Failed to add word. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}

const emit = defineEmits<{
  (e: 'word-added'): void
}>()
</script>
