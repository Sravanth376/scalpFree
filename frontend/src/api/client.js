import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60_000,
})

export async function predictScalp(file) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/api/v1/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function checkHealth() {
  try {
    const { data } = await api.get('/health')
    return data.status === 'ok'
  } catch {
    return false
  }
}
