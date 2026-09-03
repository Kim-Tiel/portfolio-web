import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { About } from './About'
import { mockEducation, mockProfile } from '../test/mocks/handlers'
describe('About', () => {
  it('renders the bio, stats, and education entries', () => {
    render(<About profile={mockProfile} education={mockEducation} />)
    expect(screen.getByText(mockProfile.bio)).toBeInTheDocument()
    expect(screen.getByText(/5\+ years experience/i)).toBeInTheDocument()
    expect(screen.getByText(mockProfile.location)).toBeInTheDocument()
    expect(screen.getByText(mockEducation[0].institution)).toBeInTheDocument()
    expect(screen.getByText(mockEducation[0].degree)).toBeInTheDocument()
  })
  it('omits the education block when there are no entries', () => {
    render(<About profile={mockProfile} education={[]} />)
    expect(screen.queryByText(/education/i)).not.toBeInTheDocument()
  })
  it('shows initials as a fallback when there is no avatar', () => {
    render(
      <About
        profile={{
          ...mockProfile,
          avatar_url: null,
        }}
        education={[]}
      />,
    )
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByTestId('avatar-initials')).toHaveTextContent('KT')
  })
  it('renders the avatar image when avatar_url is set', () => {
    const profile = {
      ...mockProfile,
      avatar_url: 'https://example.com/avatar.png',
    }
    render(<About profile={profile} education={[]} />)
    expect(
      screen.getByRole('img', {
        name: profile.name,
      }),
    ).toHaveAttribute('src', profile.avatar_url)
  })
  it('eases the cursor spotlight toward the pointer and reveals it', () => {
    render(<About profile={mockProfile} education={[]} />)
    const section = document.getElementById('about')
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
