const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
export async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)
  if (!response.ok) {
    throw new ApiError(response.status, `GET ${path} failed with status ${response.status}`)
  }
  return await response.json()
}
export async function apiPost(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    const message = Array.isArray(data.errors)
      ? data.errors.join(', ')
      : `POST ${path} failed with status ${response.status}`
    throw new ApiError(response.status, message)
  }
  return await response.json()
}
