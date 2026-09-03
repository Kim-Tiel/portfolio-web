import { useQuery } from '@tanstack/react-query'
import { apiGet } from './client'
export function fetchSkills() {
  return apiGet('/api/v1/skills')
}
export function useSkillsQuery() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills,
  })
}
