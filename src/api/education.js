import { useQuery } from '@tanstack/react-query'
import { apiGet } from './client'
export function fetchEducation() {
  return apiGet('/api/v1/education')
}
export function useEducationQuery() {
  return useQuery({
    queryKey: ['education'],
    queryFn: fetchEducation,
  })
}
