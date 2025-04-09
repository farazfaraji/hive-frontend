import { ref } from 'vue'

export const useSnackbar = () => {
  const snackbar = ref({
    show: false,
    text: '',
    color: 'success' as 'success' | 'error' | 'warning' | 'info',
    timeout: 3000,
  })

  const showSnackbar = (
    text: string,
    color: 'success' | 'error' | 'warning' | 'info' = 'success',
  ) => {
    snackbar.value = {
      show: true,
      text,
      color,
      timeout: 3000,
    }
  }

  return {
    snackbar,
    showSnackbar,
  }
}
