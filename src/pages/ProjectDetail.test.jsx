import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ProjectDetail } from './ProjectDetail'
import { ThemeProvider } from '../theme/ThemeProvider'
import { mockProjects } from '../test/mocks/handlers'
function renderAt(path) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  function Wrapper({ children }) {
    return (
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
        </QueryClientProvider>
      </ThemeProvider>
    )
  }
  return render(
    <Routes>
      <Route path="/projects/:slug" element={<ProjectDetail />} />
    </Routes>,
    {
      wrapper: Wrapper,
    },
  )
}
describe('ProjectDetail', () => {
  it('renders the project case study once loaded', async () => {
    const project = mockProjects[0]
    renderAt(`/projects/${project.slug}`)
    expect(await screen.findByText(project.title)).toBeInTheDocument()
    expect(screen.getByText(project.summary)).toBeInTheDocument()
    expect(screen.getByText(project.metrics[0].label)).toBeInTheDocument()
    expect(screen.getByText(project.metrics[0].value)).toBeInTheDocument()
    expect(screen.getByText(project.skills[0].name)).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: 'Back to projects',
      }),
    ).toHaveAttribute('href', '/')
  })
  it('shows an error state for an unknown slug', async () => {
    renderAt('/projects/does-not-exist')
    await waitFor(() => expect(screen.getByText('Could not load this project.')).toBeInTheDocument())
  })
})
