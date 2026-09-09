import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Projects } from './Projects'
import { mockProjects, mockSkills } from '../test/mocks/handlers'
const [reactProject, railsProject] = [
  mockProjects[0],
  {
    ...mockProjects[0],
    id: '2',
    slug: 'other-project',
    title: 'Other Project',
    skills: [mockSkills[1]],
  },
]
const twoProjects = [reactProject, railsProject]
function makeProjects(count) {
  return Array.from(
    {
      length: count,
    },
    (_, index) => ({
      ...mockProjects[0],
      id: `p${index}`,
      slug: `project-${index}`,
      title: `Project ${index}`,
    }),
  )
}
describe('Projects', () => {
  it('renders a card per project with its skill tags', () => {
    render(<Projects projects={twoProjects} />)
    expect(screen.getByText(reactProject.title)).toBeInTheDocument()
    expect(screen.getByText(railsProject.title)).toBeInTheDocument()
    expect(screen.getAllByText(mockSkills[0].name).length).toBeGreaterThan(0)
  })
  it('filters projects by skill when a filter tab is clicked', async () => {
    const user = userEvent.setup()
    render(<Projects projects={twoProjects} />)
    await user.click(
      screen.getByRole('button', {
        name: mockSkills[1].name,
      }),
    )
    expect(screen.getByText(railsProject.title)).toBeInTheDocument()
    expect(screen.queryByText(reactProject.title)).not.toBeInTheDocument()
  })
  it('opens a details modal with the full description when a card is clicked, and closes it again', async () => {
    const user = userEvent.setup()
    const withDescription = {
      ...reactProject,
      description: 'A much longer write-up than the card summary shows.',
    }
    render(<Projects projects={[withDescription]} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: withDescription.title,
      }),
    )
    expect(screen.getByRole('dialog', { name: withDescription.title })).toBeInTheDocument()
    expect(screen.getByText(withDescription.description)).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: /close/i,
      }),
    )
    // The dialog stays mounted through its exit animation before
    // AnimatePresence actually removes it — waitFor rides that out instead
    // of asserting the instant the close handler fires.
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
  it('shows a distinct empty state when there are no projects at all', () => {
    render(<Projects projects={[]} />)
    expect(screen.getByText('No projects yet.')).toBeInTheDocument()
  })
  it('links to the live site and repo when a project has them, and omits them when it does not', () => {
    const withLinks = {
      ...reactProject,
      site_url: 'https://example.com',
      repo_url: 'https://github.com/example/repo',
    }
    render(<Projects projects={[withLinks]} />)
    expect(
      screen.getByRole('link', {
        name: `Visit ${withLinks.title}`,
      }),
    ).toHaveAttribute('href', withLinks.site_url)
    expect(
      screen.getByRole('link', {
        name: `${withLinks.title} source code`,
      }),
    ).toHaveAttribute('href', withLinks.repo_url)
  })
  it('omits the site and repo links when a project has neither', () => {
    render(<Projects projects={[reactProject]} />)
    expect(
      screen.queryByRole('link', {
        name: new RegExp(`Visit ${reactProject.title}`),
      }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', {
        name: new RegExp(`${reactProject.title} source code`),
      }),
    ).not.toBeInTheDocument()
  })
  it('shows only the first 6 projects, loading 3 more per click until all are shown', async () => {
    const user = userEvent.setup()
    render(<Projects projects={makeProjects(10)} />)
    for (let i = 0; i < 6; i++) expect(screen.getByText(`Project ${i}`)).toBeInTheDocument()
    for (let i = 6; i < 10; i++) expect(screen.queryByText(`Project ${i}`)).not.toBeInTheDocument()
    await user.click(
      screen.getByRole('button', {
        name: /view more/i,
      }),
    )
    for (let i = 6; i < 9; i++) expect(screen.getByText(`Project ${i}`)).toBeInTheDocument()
    expect(screen.queryByText('Project 9')).not.toBeInTheDocument()
    await user.click(
      screen.getByRole('button', {
        name: /view more/i,
      }),
    )
    expect(screen.getByText('Project 9')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: /view more/i,
      }),
    ).not.toBeInTheDocument()
  })
  it('does not show "View More" when there are 6 or fewer projects', () => {
    render(<Projects projects={makeProjects(6)} />)
    expect(
      screen.queryByRole('button', {
        name: /view more/i,
      }),
    ).not.toBeInTheDocument()
  })
  it('resets the visible count back to 6 when the filter changes', async () => {
    const user = userEvent.setup()
    const projects = makeProjects(10).map((project, index) => ({
      ...project,
      skills: index === 9 ? [mockSkills[1]] : [mockSkills[0]],
    }))
    render(<Projects projects={projects} />)
    await user.click(
      screen.getByRole('button', {
        name: /view more/i,
      }),
    )
    expect(screen.getByText('Project 8')).toBeInTheDocument()
    await user.click(
      screen.getByRole('button', {
        name: mockSkills[0].name,
      }),
    )
    expect(screen.getByText('Project 0')).toBeInTheDocument()
    expect(screen.queryByText('Project 8')).not.toBeInTheDocument()
  })
})
