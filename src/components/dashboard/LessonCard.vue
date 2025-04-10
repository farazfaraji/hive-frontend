<template>
  <v-card class="mx-auto" max-width="800">
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" timeout="2000" location="top">
      {{ snackbarText }}
    </v-snackbar>

    <v-card-item v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-card-item>

    <v-card-item v-else-if="error" class="text-center">
      <v-icon color="error" size="40" class="mb-4">mdi-alert-circle</v-icon>
      <div class="text-body-1 text-error">{{ error }}</div>
    </v-card-item>

    <template v-else>
      <div v-if="!lesson" class="text-center pa-4">
        <div class="text-body-1">No lesson data available</div>
      </div>

      <template v-else>
        <!-- Grammar Section -->
        <div v-if="currentStep === 0">
          <v-card-item>
            <v-card-title class="text-h5 mb-4 text-center">
              <span v-if="lesson?.grammar">{{ lesson.grammar.item }}</span>
              <span v-else>No grammar content available</span>
            </v-card-title>
            <v-card-text class="text-body-1">
              <span v-if="lesson?.grammar">{{ lesson.grammar.definition }}</span>
            </v-card-text>
          </v-card-item>
        </div>

        <!-- News Section -->
        <div v-else-if="currentStep === 1">
          <v-card-item>
            <v-card-title class="text-h5 mb-4 text-center">Today's News</v-card-title>
            <v-card-text>
              <p class="text-body-1 mb-4">
                <template v-for="(word, index) in splitNewsIntoWords" :key="index">
                  <v-menu location="bottom" :close-on-content-click="true">
                    <template v-slot:activator="{ props }">
                      <span class="word-clickable" v-bind="props">{{ word.text }}</span>
                    </template>
                    <v-card min-width="120" class="pa-1">
                      <v-card-text class="text-center pa-1">
                        <v-btn
                          color="primary"
                          variant="text"
                          density="compact"
                          prepend-icon="mdi-plus"
                          @click="handleWordAdd(word)"
                          size="small"
                        >
                          Add
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                  <span v-if="index < splitNewsIntoWords.length - 1"> </span>
                </template>
              </p>
              <v-divider class="mb-4"></v-divider>
              <p class="text-body-2">{{ lesson?.news?.explanation }}</p>
            </v-card-text>
          </v-card-item>
        </div>

        <!-- Exam Section -->
        <div v-else-if="currentStep === 2">
          <v-card-item>
            <v-card-title class="text-h5 mb-4 text-center">Exam</v-card-title>
            <v-card-text>
              <div v-if="examStep === 0">
                <p class="text-body-1 mb-4">
                  <template v-for="(word, index) in splitExamTextIntoWords" :key="index">
                    <v-menu location="bottom" :close-on-content-click="true">
                      <template v-slot:activator="{ props }">
                        <span class="word-clickable" v-bind="props">{{ word.text }}</span>
                      </template>
                      <v-card min-width="120" class="pa-1">
                        <v-card-text class="text-center pa-1">
                          <v-btn
                            color="primary"
                            variant="text"
                            density="compact"
                            prepend-icon="mdi-plus"
                            @click="handleWordAdd(word)"
                            size="small"
                          >
                            Add
                          </v-btn>
                        </v-card-text>
                      </v-card>
                    </v-menu>
                    <span v-if="index < splitExamTextIntoWords.length - 1"> </span>
                  </template>
                </p>
              </div>
              <div v-else-if="examStep === 1">
                <div v-if="currentChoiceQuestion < lesson?.exam?.choices?.length">
                  <p class="text-h6 mb-4">
                    {{ lesson?.exam?.choices[currentChoiceQuestion].question }}
                  </p>
                  <v-radio-group v-model="selectedChoice">
                    <v-radio
                      v-for="(choice, index) in lesson?.exam?.choices[currentChoiceQuestion]
                        .choices"
                      :key="index"
                      :label="choice"
                      :value="choice"
                    ></v-radio>
                  </v-radio-group>
                  <v-alert
                    v-if="showChoiceFeedback"
                    :color="choiceCorrect ? 'success' : 'error'"
                    class="mt-4"
                  >
                    {{
                      choiceCorrect
                        ? 'Correct!'
                        : `Incorrect. The correct answer is: ${lesson?.exam?.choices[currentChoiceQuestion].answer}`
                    }}
                  </v-alert>
                </div>
                <div v-else-if="currentSimpleQuestion < lesson?.exam?.simple?.length">
                  <p class="text-h6 mb-4">
                    {{ lesson?.exam?.simple[currentSimpleQuestion].question }}
                  </p>
                  <v-radio-group v-model="selectedSimple">
                    <v-radio label="True" value="true"></v-radio>
                    <v-radio label="False" value="false"></v-radio>
                  </v-radio-group>
                  <v-alert
                    v-if="showSimpleFeedback"
                    :color="simpleCorrect ? 'success' : 'error'"
                    class="mt-4"
                  >
                    {{
                      simpleCorrect
                        ? 'Correct!'
                        : `Incorrect. The correct answer is: ${lesson?.exam?.simple[currentSimpleQuestion].answer}`
                    }}
                  </v-alert>
                </div>
                <div v-else>
                  <div v-if="lesson?.exam?.plan === 'reading' && !readingSubmitted">
                    <v-card-title class="text-h5 mb-4 text-center">Reading Exam</v-card-title>
                    <v-card-text>
                      <v-textarea
                        v-model="readingAnswer"
                        label="Write a summary of the reading"
                        :error="!!readingError"
                        :error-messages="readingError"
                        rows="4"
                        auto-grow
                        class="mb-4"
                      ></v-textarea>
                    </v-card-text>
                  </div>
                  <v-alert v-else color="success" class="mb-4">
                    Congratulations! You have completed the exam!
                  </v-alert>
                </div>
              </div>
            </v-card-text>
          </v-card-item>
        </div>

        <!-- Reading Exam Results -->
        <v-card-item v-if="lesson?.exam?.plan === 'reading' && readingResponse">
          <v-card-title class="text-h5 mb-4 text-center">Reading Exam Results</v-card-title>
          <v-card-text>
            <v-alert
              :color="readingResponse.score >= 70 ? 'success' : 'warning'"
              class="mb-4"
              variant="tonal"
            >
              <div class="d-flex align-center justify-center mb-2">
                <v-icon size="large" class="mr-2">mdi-star</v-icon>
                <span class="text-h4">{{ readingResponse.score }}%</span>
              </div>
              <v-divider class="my-4"></v-divider>
              <div class="text-body-1">
                <p class="font-weight-bold mb-2">Advices for Improvement:</p>
                <ul>
                  <li v-for="(advice, index) in readingResponse.advices" :key="index" class="mb-2">
                    {{ advice }}
                  </li>
                </ul>
              </div>
            </v-alert>
          </v-card-text>
        </v-card-item>

        <!-- Dialogue Section -->
        <div v-else-if="currentStep === 3">
          <v-card-item>
            <v-card-title class="text-h5 mb-4 text-center">Conversation</v-card-title>
            <v-card-text>
              <v-timeline density="compact">
                <v-timeline-item
                  v-for="(line, index) in lesson?.dialogue?.dialogue"
                  :key="index"
                  :dot-color="line.firstPerson ? 'primary' : 'secondary'"
                  size="small"
                >
                  <template v-slot:opposite>
                    <div class="text-caption">
                      {{ line.firstPerson || line.secondPerson }}
                    </div>
                  </template>
                  <div class="text-body-2">
                    <template
                      v-for="(word, wordIndex) in splitSentenceIntoWords(line.sentence)"
                      :key="wordIndex"
                    >
                      <v-menu location="bottom" :close-on-content-click="true">
                        <template v-slot:activator="{ props }">
                          <span class="word-clickable" v-bind="props">{{ word.text }}</span>
                        </template>
                        <v-card min-width="120" class="pa-1">
                          <v-card-text class="text-center pa-1">
                            <v-btn
                              color="primary"
                              variant="text"
                              density="compact"
                              prepend-icon="mdi-plus"
                              @click="handleWordAdd(word)"
                              size="small"
                            >
                              Add
                            </v-btn>
                          </v-card-text>
                        </v-card>
                      </v-menu>
                      <span v-if="wordIndex < splitSentenceIntoWords(line.sentence).length - 1">
                      </span>
                    </template>
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card-item>
        </div>

        <!-- Questions Section -->
        <div v-else-if="currentStep === 4">
          <v-card-item>
            <v-card-title class="text-h5 mb-4 text-center">Questions</v-card-title>
            <v-card-text>
              <div v-if="loading">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
              <div v-else>
                <p class="text-h6 mb-4">{{ currentQuestion?.question }}</p>

                <v-textarea
                  v-model="userAnswer"
                  label="Your Answer"
                  :error="!!answerError"
                  :error-messages="answerError"
                  :disabled="loading"
                  rows="3"
                  auto-grow
                  class="mb-4"
                ></v-textarea>

                <div class="d-flex align-center mb-4">
                  <v-btn
                    color="primary"
                    :loading="submitting"
                    :disabled="!userAnswer || submitting"
                    @click="checkAnswer"
                  >
                    Check Answer
                  </v-btn>
                </div>

                <v-alert
                  v-if="answerResponse"
                  :color="answerResponse.correct === 'yes' ? 'success' : 'error'"
                  :icon="answerResponse.correct === 'yes' ? 'mdi-check-circle' : 'mdi-alert-circle'"
                  class="mb-4"
                >
                  <template v-if="answerResponse.correct === 'no'">
                    <p class="mb-2"><strong>Score:</strong> {{ answerResponse.score }}%</p>
                    <p class="mb-2"><strong>Corrections:</strong></p>
                    <ul class="mb-2">
                      <li
                        v-for="(correction, index) in answerResponse.corrections"
                        :key="index"
                        class="mb-1"
                      >
                        {{ correction }}
                      </li>
                    </ul>
                    <p><strong>Alternative Answer:</strong> {{ answerResponse.alternative }}</p>
                  </template>
                  <template v-else>
                    <p>Great job! Your answer is correct!</p>
                  </template>
                </v-alert>
              </div>
            </v-card-text>
          </v-card-item>
        </div>

        <!-- Practice Section -->
        <div v-else-if="currentStep === 5">
          <v-card-item>
            <v-card-title class="text-h5 mb-4 text-center">It's Your Turn To Speak</v-card-title>
            <v-card-text class="text-center">
              <v-icon size="64" color="primary">mdi-microphone</v-icon>
              <p class="text-body-1 mt-4">This feature is coming soon!</p>
            </v-card-text>
          </v-card-item>
        </div>

        <!-- Words Section -->
        <div v-else-if="currentStep === 6">
          <v-card-item>
            <v-card-title class="text-h5 mb-4 text-center">Words of the Day</v-card-title>
            <v-card-text>
              <v-expansion-panels>
                <v-expansion-panel v-for="(word, index) in lesson?.words" :key="index">
                  <v-expansion-panel-title>
                    <div class="d-flex align-center justify-space-between">
                      <span class="text-h6">{{ word.word }}</span>
                      <v-btn
                        color="primary"
                        variant="text"
                        icon="mdi-plus"
                        @click.stop="addWord(word.word)"
                      ></v-btn>
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div class="mb-4">
                      <strong>Context:</strong>
                      <ul>
                        <li v-for="(ctx, idx) in word.context" :key="idx">{{ ctx }}</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Examples:</strong>
                      <ul>
                        <li v-for="(example, idx) in word.examples" :key="idx">{{ example }}</li>
                      </ul>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card-item>
        </div>

        <v-card-actions class="pa-4">
          <v-btn color="primary" variant="text" @click="currentStep--" :disabled="currentStep <= 0">
            <v-icon start>mdi-arrow-left</v-icon>
            Previous
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :loading="isFinishingLesson"
            @click="currentStep === 6 ? finishLesson() : handleNext()"
            :disabled="currentStep > 6 || isFinishingLesson"
          >
            {{ currentStep === 6 ? 'Finish' : 'Next' }}
            <v-icon end>{{ currentStep === 6 ? 'mdi-check' : 'mdi-arrow-right' }}</v-icon>
          </v-btn>
        </v-card-actions>
      </template>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import lessonService from '@/api/services/lesson.service'
import type { LessonResponse } from '@/api/services/lesson.service'
import { WordService } from '@/api/services/word.service'
import { QuestionService } from '@/api/services/question.service'
import type { QuestionResponse, AnswerResponse } from '@/api/services/question.service'

const loading = ref(true)
const error = ref<string | null>(null)
const currentStep = ref(0)
const lesson = ref<LessonResponse | null>(null)

const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const currentQuestion = ref<QuestionResponse | null>(null)
const userAnswer = ref('')
const answerResponse = ref<AnswerResponse | null>(null)
const answerError = ref('')
const submitting = ref(false)
const questionCount = ref(0)
const isFinishingLesson = ref(false)

// Add new refs for exam
const examStep = ref(0)
const currentChoiceQuestion = ref(0)
const currentSimpleQuestion = ref(0)
const selectedChoice = ref('')
const selectedSimple = ref('')
const showChoiceFeedback = ref(false)
const showSimpleFeedback = ref(false)
const choiceCorrect = ref(false)
const simpleCorrect = ref(false)

// Add these new refs in the script section
const readingAnswer = ref('')
const readingError = ref('')
const readingResponse = ref<ReadingCorrectionResponse | null>(null)
const readingSubmitted = ref(false)

// Add watcher for currentStep
watch(currentStep, (newStep) => {
  console.log('Current step changed to:', newStep)
  console.log('Current lesson data:', lesson.value)
})

interface WordWithMenu {
  text: string
  showMenu: boolean
}

const handleWordAdd = async (word: WordWithMenu) => {
  try {
    await addWordToList(word.text)
    snackbarText.value = `'${word.text}' added to your word list`
    snackbarColor.value = 'success'
    showSnackbar.value = true
  } catch (err) {
    console.error('Failed to add word:', err)
    snackbarText.value = 'Failed to add word'
    snackbarColor.value = 'error'
    showSnackbar.value = true
  }
}

const splitNewsIntoWords = computed(() => {
  if (!lesson.value?.news?.news) return []
  // Split by spaces and remove any empty strings
  return lesson.value.news.news
    .split(' ')
    .filter((word) => word.trim())
    .map((word) => ({
      text: word,
      showMenu: false,
    }))
})

const addWordToList = async (word: string) => {
  try {
    await WordService.addWord(word)
    // Optional: Add success notification
  } catch (error) {
    console.error('Failed to add word:', error)
    // Optional: Add error notification
  }
}

const splitSentenceIntoWords = (sentence: string) => {
  if (!sentence) return []
  return sentence
    .split(' ')
    .filter((word) => word.trim())
    .map((word) => ({
      text: word,
      showMenu: false,
    }))
}

const loadQuestion = async () => {
  try {
    loading.value = true
    answerError.value = ''
    userAnswer.value = ''
    answerResponse.value = null

    const response = await QuestionService.getQuestion()
    currentQuestion.value = response
  } catch (err) {
    console.error('Failed to load question:', err)
    // Check if error is about maximum questions reached
    if (err instanceof Error && err.message.includes('maximum number of questions')) {
      // Move to next section after a short delay
      setTimeout(() => {
        currentStep.value++
        questionCount.value = 0
      }, 1000)
    } else {
      error.value = 'Failed to load question'
    }
  } finally {
    loading.value = false
  }
}

const checkAnswer = async () => {
  if (!userAnswer.value.trim()) return

  try {
    submitting.value = true
    answerError.value = ''

    const response = await QuestionService.submitAnswer(userAnswer.value.trim())
    answerResponse.value = response

    if (response.correct === 'yes') {
      questionCount.value++
      if (questionCount.value >= 3) {
        // Move to next section after a short delay
        setTimeout(() => {
          currentStep.value++
          questionCount.value = 0
        }, 1500)
      } else {
        // Load next question after a short delay
        setTimeout(loadQuestion, 1500)
      }
    }
  } catch (err) {
    console.error('Failed to submit answer:', err)
    answerError.value = 'Failed to submit answer'
  } finally {
    submitting.value = false
  }
}

// Watch for step changes to load question when entering Questions section
watch(currentStep, (newStep) => {
  if (newStep === 4) {
    loadQuestion()
    questionCount.value = 0
  }
})

const finishLesson = async () => {
  try {
    isFinishingLesson.value = true
    const response = await lessonService.finishLesson()
    if (response.status === 'success') {
      snackbarText.value = 'Congratulations! You have completed the lesson!'
      snackbarColor.value = 'success'
      showSnackbar.value = true
    }
  } catch (error) {
    console.error('Error finishing lesson:', error)
    snackbarText.value = 'Failed to complete the lesson'
    snackbarColor.value = 'error'
    showSnackbar.value = true
  } finally {
    isFinishingLesson.value = false
  }
}

// Add new methods for exam
const checkChoiceAnswer = () => {
  if (!selectedChoice.value) return

  const correctAnswer = lesson.value?.exam?.choices[currentChoiceQuestion.value].answer
  choiceCorrect.value = selectedChoice.value === correctAnswer
  showChoiceFeedback.value = true

  if (choiceCorrect.value) {
    setTimeout(() => {
      currentChoiceQuestion.value++
      selectedChoice.value = ''
      showChoiceFeedback.value = false
    }, 1500)
  }
}

const checkSimpleAnswer = () => {
  if (!selectedSimple.value) return

  const correctAnswer = lesson.value?.exam?.simple[currentSimpleQuestion.value].answer
  simpleCorrect.value = selectedSimple.value === correctAnswer
  showSimpleFeedback.value = true

  if (simpleCorrect.value) {
    setTimeout(() => {
      currentSimpleQuestion.value++
      selectedSimple.value = ''
      showSimpleFeedback.value = false
    }, 1500)
  }
}

// Add this new method in the script section
const submitReadingAnswer = async () => {
  if (!readingAnswer.value.trim()) {
    readingError.value = 'Please write a summary'
    return
  }

  try {
    readingError.value = ''
    const response = await lessonService.submitReadingCorrection(readingAnswer.value.trim())
    readingResponse.value = response
    readingSubmitted.value = true
  } catch (err) {
    console.error('Failed to submit reading answer:', err)
    readingError.value = 'Failed to submit reading answer'
  }
}

// Update the handleNext method
const handleNext = () => {
  if (currentStep.value === 2) {
    if (examStep.value === 0) {
      examStep.value = 1
    } else if (currentChoiceQuestion.value < lesson.value?.exam?.choices?.length) {
      checkChoiceAnswer()
    } else if (currentSimpleQuestion.value < lesson.value?.exam?.simple?.length) {
      checkSimpleAnswer()
    } else if (lesson.value?.exam?.plan === 'reading' && !readingSubmitted.value) {
      submitReadingAnswer()
    } else {
      currentStep.value++
      examStep.value = 0
      currentChoiceQuestion.value = 0
      currentSimpleQuestion.value = 0
      readingSubmitted.value = false
      readingResponse.value = null
      readingAnswer.value = ''
    }
  } else {
    currentStep.value++
  }
}

const splitExamTextIntoWords = computed(() => {
  if (!lesson.value?.exam?.text) return []
  // Split by spaces and remove any empty strings
  return lesson.value.exam.text
    .split(' ')
    .filter((word) => word.trim())
    .map((word) => ({
      text: word,
      showMenu: false,
    }))
})

onMounted(async () => {
  try {
    const response = await lessonService.getLesson()
    console.log('Lesson data received:', response) // More detailed debug log
    if (response?.grammar) {
      console.log('Grammar data:', response.grammar)
    } else {
      console.log('No grammar data in response')
    }
    lesson.value = response
  } catch (error: Error | unknown) {
    console.error('Failed to load lesson:', error)
    error.value = error instanceof Error ? error.message : 'Failed to load lesson data'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.v-timeline {
  max-height: 400px;
  overflow-y: auto;
}

.word-clickable {
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  display: inline-block;
}

.word-clickable:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
}
</style>
