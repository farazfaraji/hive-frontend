<template>
  <v-container fluid>
    <v-row>
      <!-- Left Panel - Drawer Menu -->
      <v-col cols="12" md="3">
        <v-card class="mb-4 grammar-list-card">
          <v-card-title>Grammar Topics</v-card-title>
          <v-list class="scrollable-list">
            <template v-for="item in grammarList" :key="item._id">
              <v-list-item class="sub-item" @click="selectItem(item)">
                <v-list-item-content>
                  <v-list-item-title class="sub-item-title">{{ item.item }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider />
            </template>
          </v-list>
        </v-card>
      </v-col>

      <!-- Right Panel - Content -->
      <v-col cols="12" md="9">
        <v-card v-if="selectedItem" class="grammar-card">
          <v-card-title>{{ selectedItem.item }}</v-card-title>
          <v-card-text>
            <div v-if="selectedItem.definition" class="definition">
              <h3>Definition:</h3>
              <p>{{ selectedItem.definition }}</p>
            </div>

            <div v-if="examples.length > 0" class="examples">
              <h3>Examples:</h3>
              <v-list>
                <v-list-item v-for="(example, index) in examples" :key="index" class="example-item">
                  <v-list-item-content>
                    <v-list-item-title class="example-sentence">{{
                      example.sentence
                    }}</v-list-item-title>
                    <v-list-item-subtitle class="example-explanation">{{
                      example.explanation
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>

            <v-btn
              v-if="selectedItem.definition"
              color="primary"
              class="mt-4"
              @click="showExamples"
              :loading="loadingExamples"
              :disabled="loadingExamples"
            >
              {{ examples.length > 0 ? 'More Examples' : 'Show Examples' }}
            </v-btn>
          </v-card-text>
        </v-card>
        <v-card v-else class="grammar-card">
          <v-card-text class="text-center">
            <h2>Select a grammar topic to view details</h2>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import grammarService, { GrammarItem, GrammarExample } from '@/api/services/grammar.service'

defineOptions({
  name: 'GrammarCard',
})

const grammarList = ref<GrammarItem[]>([])
const selectedItem = ref<GrammarItem | null>(null)
const examples = ref<GrammarExample[]>([])
const loadingExamples = ref(false)

const fetchGrammarList = async () => {
  try {
    grammarList.value = await grammarService.getGrammarList()
  } catch (error) {
    console.error('Error fetching grammar list:', error)
  }
}

const selectItem = async (item: GrammarItem) => {
  try {
    selectedItem.value = await grammarService.getGrammarDefinition(item._id)
    examples.value = [] // Clear previous examples
  } catch (error) {
    console.error('Error fetching grammar definition:', error)
  }
}

const showExamples = async () => {
  if (!selectedItem.value) return

  try {
    loadingExamples.value = true
    const response = await grammarService.getGrammarExamples(selectedItem.value._id)
    examples.value = response.examples
  } catch (error) {
    console.error('Error fetching grammar examples:', error)
  } finally {
    loadingExamples.value = false
  }
}

onMounted(() => {
  fetchGrammarList()
})
</script>

<style scoped>
.grammar-card {
  padding: 2rem;
}

.grammar-list-card {
  height: calc(100vh - 300px);
  display: flex;
  flex-direction: column;
  max-height: 600px;
}

.scrollable-list {
  overflow-y: auto;
  flex: 1;
}

.definition {
  margin-bottom: 1rem;
}

.examples {
  margin: 1rem 0;
}

.sub-item {
  cursor: pointer;
  padding: 8px 16px;
}

.sub-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.example-item {
  margin-bottom: 1rem;
}

.example-sentence {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  white-space: normal;
}

.example-explanation {
  white-space: normal;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.7);
}

.sub-item-title {
  white-space: normal;
  line-height: 1.4;
  font-size: 0.85rem;
}
</style>
