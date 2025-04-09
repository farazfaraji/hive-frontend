<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-6 text-center">Hive</h1>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-6">
      <v-col cols="auto">
        <v-btn-toggle v-model="selectedTab" mandatory color="primary" rounded="xl">
          <v-btn value="words" size="large">
            <v-icon start>mdi-book-alphabet</v-icon>
            Words
          </v-btn>
          <v-btn value="lesson" size="large">
            <v-icon start>mdi-school</v-icon>
            Lesson
          </v-btn>
          <v-btn value="grammar" size="large">
            <v-icon start>mdi-book-open-variant</v-icon>
            Grammar
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <WordCard v-if="selectedTab === 'words'" />
        <LessonCard v-else-if="selectedTab === 'lesson'" />
        <GrammarCard v-else />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WordCard from '@/components/dashboard/WordCard.vue'
import GrammarCard from '@/components/dashboard/GrammarCard.vue'
import LessonCard from '@/components/dashboard/LessonCard.vue'

const selectedTab = ref('words')

defineOptions({
  name: 'DashboardView',
})
</script>

<style scoped>
.v-container {
  max-width: 1200px;
}
</style>
