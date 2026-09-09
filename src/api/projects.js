import { useQuery } from '@tanstack/react-query'
import { apiGet } from './client'
export function fetchProjects() {
  return apiGet('/api/v1/projects')
}
export function useProjectsQuery() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })
}
