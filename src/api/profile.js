import { useQuery } from '@tanstack/react-query'
import { apiGet } from './client'
export function fetchProfile() {
  return apiGet('/api/v1/profile')
}
export function useProfileQuery() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  })
}
