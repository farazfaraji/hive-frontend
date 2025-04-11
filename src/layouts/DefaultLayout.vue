<script setup lang="ts">
import { RouterView } from 'vue-router'
import { AuthService } from '@/api/services/auth.service'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  AuthService.logout()
  router.push('/')
}
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="compact">
      <v-app-bar-title>Hive</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn color="white" variant="text" prepend-icon="mdi-logout" @click="handleLogout">
        Logout
      </v-btn>
    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
