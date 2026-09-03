import { useQuery } from '@tanstack/react-query'
import { apiGet } from './client'
export function fetchProjects() {
  return apiGet('/api/v1/projects')
}
export function fetchProject(slug) {
  return apiGet(`/api/v1/projects/${slug}`)
}
export function useProjectsQuery() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })
}
export function useProjectQuery(slug) {
  return useQuery({
    queryKey: ['projects', slug],
    queryFn: () => fetchProject(slug),
    enabled: Boolean(slug),
  })
}
