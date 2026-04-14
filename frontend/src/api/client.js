import axios from 'axios'

function normalizeBaseUrl(value) {
  if (!value) {
    return ''
  }

  return value.endsWith('/') ? value.slice(0, -1) : value
}

function buildUrl(path) {
  return `${normalizeBaseUrl(import.meta.env.VITE_API_URL)}${path}`
}

const api = axios.create({
  timeout: 60_000,
})

export async function predictScalp(file) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post(buildUrl('/api/v1/predict'), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return data
}

export async function checkHealth() {
  try {
    const { data } = await api.get(buildUrl('/health'))
    return data.status === 'ok'
  } catch {
    return false
  }
}
