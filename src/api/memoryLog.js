import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost } from './client'

export const MEMORY_LOG_KEY = ['memory-log']

export function fetchMemoryLog() {
  return apiGet('/api/v1/memory_log_entries')
}

export function useMemoryLogQuery() {
  return useQuery({
    queryKey: MEMORY_LOG_KEY,
    queryFn: fetchMemoryLog,
  })
}

export function submitMemoryLogEntry(input) {
  return apiPost('/api/v1/memory_log_entries', { memory_log_entry: input })
}

export function useSubmitMemoryLogEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submitMemoryLogEntry,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MEMORY_LOG_KEY }),
  })
}
