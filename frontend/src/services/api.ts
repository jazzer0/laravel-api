import axios from 'axios'

declare module 'axios' {
  export interface AxiosError {
    userMessage?: string
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errors = error.response?.data?.errors
    const message =
      error.response?.data?.message ??
      (errors ? Object.values(errors).flat()[0] : null) ??
      'Erro inesperado. Tente novamente.'

    error.userMessage = message
    return Promise.reject(error)
  },
)

export default api
