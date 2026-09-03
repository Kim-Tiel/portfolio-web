import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Footer } from './Footer'
import { mockProfile, mockProjects, mockSkills } from '../test/mocks/handlers'
describe('Footer', () => {
  it('shows the quick links, email, and location', () => {
    render(<Footer profile={mockProfile} projects={[]} skills={[]} />, {
      wrapper: MemoryRouter,
    })
    expect(
      screen.getByRole('button', {
        name: /Home/,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /Contact/,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(mockProfile.location)).toBeInTheDocument()
  })
  it('lists featured projects, falling back to the first ones when none are marked featured', () => {
    const notFeatured = mockProjects.map((project) => ({
      ...project,
      is_featured: false,
    }))
    render(<Footer profile={mockProfile} projects={notFeatured} skills={[]} />, {
      wrapper: MemoryRouter,
    })
    expect(screen.getByText(notFeatured[0].title)).toBeInTheDocument()
  })
  it('lists each unique skill name once in the tech stack', () => {
    const duplicated = [...mockSkills, mockSkills[0]]
    render(<Footer profile={mockProfile} projects={[]} skills={duplicated} />, {
      wrapper: MemoryRouter,
    })
    expect(screen.getAllByText(mockSkills[0].name)).toHaveLength(1)
  })
  it('omits the location and profile-dependent lines when there is no profile yet', () => {
    render(<Footer projects={[]} skills={[]} />, {
      wrapper: MemoryRouter,
    })
    expect(screen.queryByText(mockProfile.location)).not.toBeInTheDocument()
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument()
  })
})
