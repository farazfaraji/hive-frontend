<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <AddWordDialog @word-added="fetchWord" />
        <v-card class="word-card" elevation="2">
          <v-card-text class="text-center">
            <template v-if="noWordsAvailable">
              <h2 class="no-words-message">No Candidate Word</h2>
            </template>
            <template v-else>
              <div v-if="word" class="word-content text-left">
                <h2 class="word-title">{{ word.word }}</h2>
                <v-divider class="my-4"></v-divider>

                <div class="meaning-section">
                  <h3 class="section-title">Meaning</h3>
                  <p class="text-left">{{ word.meaning }}</p>
                </div>

                <v-divider class="my-4"></v-divider>

                <div class="example-section">
                  <h3 class="section-title">Example</h3>
                  <p class="text-left">{{ word.example }}</p>
                </div>

                <v-divider class="my-4"></v-divider>

                <div class="translation-section">
                  <h3 class="section-title">Translation</h3>
                  <p class="text-left">{{ word.translation }}</p>
                </div>

                <v-divider class="my-4"></v-divider>

                <div v-if="word.synonyms?.length" class="synonyms-section">
                  <h3 class="section-title">Synonyms</h3>
                  <v-chip-group class="justify-start">
                    <v-chip
                      v-for="synonym in word.synonyms"
                      :key="synonym"
                      color="primary"
                      variant="outlined"
                    >
                      {{ synonym }}
                    </v-chip>
                  </v-chip-group>
                </div>

                <v-divider class="my-4"></v-divider>

                <div v-if="word.contexts?.length" class="contexts-section">
                  <h3 class="section-title">Contexts</h3>
                  <v-chip-group class="justify-start">
                    <v-chip
                      v-for="context in word.contexts"
                      :key="context"
                      color="info"
                      variant="outlined"
                    >
                      {{ context }}
                    </v-chip>
                  </v-chip-group>
                </div>

                <v-divider class="my-4"></v-divider>

                <v-card-actions class="mt-4 justify-center">
                  <v-btn color="success" variant="tonal" :loading="loading" @click="handleLearned">
                    I Learnt
                  </v-btn>
                  <v-btn color="warning" variant="tonal" :loading="loading" @click="handleTryLater">
                    Try Later
                  </v-btn>
                </v-card-actions>
              </div>

              <v-progress-circular
                v-if="loading"
                indeterminate
                color="primary"
                class="mt-4"
              ></v-progress-circular>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { WordService, type WordCandidate } from '@/api/services/word.service'
import { AxiosError } from 'axios'
import AddWordDialog from './AddWordDialog.vue'

const word = ref<WordCandidate | null>(null)
const loading = ref(false)
const noWordsAvailable = ref(false)

const fetchWord = async () => {
  try {
    loading.value = true
    noWordsAvailable.value = false
    word.value = await WordService.getCandidate()
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      noWordsAvailable.value = true
      word.value = null
    } else {
      console.error('Error fetching word:', error)
      noWordsAvailable.value = true
      word.value = null
    }
  } finally {
    loading.value = false
  }
}

const handleLearned = async () => {
  if (!word.value) return

  try {
    loading.value = true
    await WordService.acknowledgeWord(word.value.uniqueId)
    await fetchWord()
  } catch (error) {
    console.error('Error acknowledging word:', error)
  } finally {
    loading.value = false
  }
}

const handleTryLater = async () => {
  if (!word.value) return

  try {
    loading.value = true
    await WordService.tryLater(word.value.uniqueId)
    await fetchWord()
  } catch (error) {
    console.error('Error marking word for later:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchWord())
</script>

<style scoped>
.word-card {
  padding: 2rem;
}

.word-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.clickable {
  cursor: pointer;
  transition: color 0.3s ease;
}

.clickable:hover {
  color: var(--v-primary-base);
}

.section-title {
  font-size: 1.2rem;
  color: var(--v-primary-darken1);
  margin-bottom: 0.5rem;
}

.translation-content {
  text-align: left;
}

.no-words-message {
  font-size: 1.5rem;
  color: var(--v-warning-base);
  margin: 2rem 0;
}
</style>
