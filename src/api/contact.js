import { useMutation } from '@tanstack/react-query'
import { apiPost } from './client'
export function submitContactMessage(input) {
  return apiPost('/api/v1/contact_messages', {
    contact_message: input,
  })
}
export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: submitContactMessage,
  })
}
