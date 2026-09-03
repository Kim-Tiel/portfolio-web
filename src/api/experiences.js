import { useQuery } from '@tanstack/react-query'
import { apiGet } from './client'
export function fetchExperiences() {
  return apiGet('/api/v1/experiences')
}
export function useExperiencesQuery() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: fetchExperiences,
  })
}
