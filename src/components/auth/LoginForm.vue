<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 pa-6">
          <v-card-title class="text-h5 text-center mb-4"> Login To Your Hive </v-card-title>
          <v-form @submit.prevent="handleSubmit" v-model="isFormValid" ref="form">
            <v-text-field
              v-model="formData.email"
              :rules="emailRules"
              label="Email"
              required
              prepend-icon="mdi-email"
              variant="outlined"
              type="email"
            ></v-text-field>

            <v-text-field
              v-model="formData.password"
              :rules="passwordRules"
              label="Password"
              required
              prepend-icon="mdi-lock"
              variant="outlined"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
            ></v-text-field>

            <v-alert v-if="error" type="error" class="mb-4" closable>
              {{ error }}
            </v-alert>

            <v-btn
              color="primary"
              block
              size="large"
              type="submit"
              :loading="loading"
              :disabled="!isFormValid"
            >
              Login
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '@/api/services/auth.service'

const router = useRouter()
const form = ref(null)
const isFormValid = ref(false)
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const formData = reactive({
  email: '',
  password: '',
})

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
]

const handleSubmit = async () => {
  console.log(formData)
  try {
    loading.value = true
    error.value = ''

    const response = await AuthService.login(formData)
    localStorage.setItem('token', response.token)
    router.push('/dashboard')
  } catch (error) {
    error.value = error instanceof Error ? error.message : 'An error occurred during login'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}
</style>
