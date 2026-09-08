import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Intro } from './Intro'
import { mockProfile } from '../test/mocks/handlers'
describe('Intro', () => {
  it('renders the profile first/last name, tagline, and availability', () => {
    render(<Intro profile={mockProfile} />)
    expect(screen.getByText(mockProfile.first_name)).toBeInTheDocument()
    expect(screen.getByText(mockProfile.last_name)).toBeInTheDocument()
    expect(screen.getByText(mockProfile.hero_tagline)).toBeInTheDocument()
    expect(screen.getByText(/available for full-time & contract/i)).toBeInTheDocument()
  })
  it('exposes the profile title as a stable accessible label for the animated role line', () => {
    const { container } = render(<Intro profile={mockProfile} />)
    expect(container.querySelector(`[aria-label="${mockProfile.title}"]`)).toBeInTheDocument()
  })
  it('omits the availability line when available_for is empty', () => {
    render(
      <Intro
        profile={{
          ...mockProfile,
          available_for: [],
        }}
      />,
    )
    expect(screen.queryByText(/available for/i)).not.toBeInTheDocument()
  })
  it('scrolls to the projects section when "View My Work" is clicked', async () => {
    render(<Intro profile={mockProfile} />)
    const projectsSection = document.createElement('section')
    projectsSection.id = 'projects'
    document.body.appendChild(projectsSection)
    const scrollSpy = vi.fn()
    projectsSection.scrollIntoView = scrollSpy
    screen
      .getByRole('button', {
        name: /view my work/i,
      })
      .click()
    expect(scrollSpy).toHaveBeenCalledWith({
      behavior: 'smooth',
    })
  })
  it('renders the "Find Me On" social links', () => {
    render(<Intro profile={mockProfile} />)
    expect(screen.getByText('Find Me On')).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: 'GitHub',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: 'LinkedIn',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: 'Email',
      }),
    ).toHaveAttribute('href', expect.stringContaining('mailto:'))
  })
  it('hides the resume button when there is no resume', () => {
    render(<Intro profile={{ ...mockProfile, resume_url: null }} />)
    expect(screen.queryByText('Resume')).not.toBeInTheDocument()
  })
  it('hides GitHub, LinkedIn, and email links that are not set on the profile', () => {
    render(<Intro profile={{ ...mockProfile, github_url: null, linkedin_url: null, email: null }} />)
    expect(
      screen.queryByRole('link', {
        name: 'GitHub',
      }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', {
        name: 'LinkedIn',
      }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', {
        name: 'Email',
      }),
    ).not.toBeInTheDocument()
  })
  it('eases the cursor spotlight toward the pointer on mouse move and reveals it', () => {
    render(<Intro profile={mockProfile} />)
    const section = document.getElementById('home')
    const spotlight = screen.getByTestId('cursor-spotlight')
    fireEvent.mouseMove(section, {
      clientX: 120,
      clientY: 80,
    })
    expect(spotlight.style.left).toBe('120px')
    expect(spotlight.style.top).toBe('80px')
    expect(spotlight.style.opacity).toBe('1')
  })
})
