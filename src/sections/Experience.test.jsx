import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Experience } from './Experience'
import { mockExperiences, mockProfile } from '../test/mocks/handlers'
describe('Experience', () => {
  it('lists every role as a commit with its company and dates', () => {
    render(<Experience experiences={mockExperiences} profile={mockProfile} />)
    const experience = mockExperiences[0]
    expect(
      screen.getByRole('button', {
        name: new RegExp(experience.role),
      }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(new RegExp(experience.company)).length).toBeGreaterThan(0)
  })
  it('orders commits most-recent start date first, marking the newest as HEAD', () => {
    const older = {
      ...mockExperiences[0],
      id: 'older',
      role: 'Older Role',
      start_date: '2019-01-01',
    }
    const newer = {
      ...mockExperiences[0],
      id: 'newer',
      role: 'Newer Role',
      start_date: '2024-01-01',
    }
    render(<Experience experiences={[older, newer]} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toHaveTextContent('Newer Role')
    expect(buttons[0]).toHaveTextContent('HEAD → main')
    expect(buttons[1]).toHaveTextContent('Older Role')
    expect(buttons[1]).not.toHaveTextContent('HEAD → main')
  })
  it('shows the most recent commit selected by default, with its highlights and skills', () => {
    render(<Experience experiences={mockExperiences} profile={mockProfile} />)
    const experience = mockExperiences[0]
    expect(screen.getByText(experience.highlights[0])).toBeInTheDocument()
    expect(screen.getByText(experience.skills[0].name)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(mockProfile.name))).toBeInTheDocument()
  })
  it('switches the detail panel when a different commit is clicked', () => {
    const older = {
      ...mockExperiences[0],
      id: 'older',
      role: 'Older Role',
      start_date: '2019-01-01',
    }
    const newer = {
      ...mockExperiences[0],
      id: 'newer',
      role: 'Newer Role',
      start_date: '2024-01-01',
    }
    render(<Experience experiences={[older, newer]} />)
    expect(
      screen.getByRole('heading', {
        name: 'Newer Role',
      }),
    ).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', {
        name: /Older Role/,
      }),
    )
    expect(
      screen.getByRole('heading', {
        name: 'Older Role',
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', {
        name: 'Newer Role',
      }),
    ).not.toBeInTheDocument()
  })
  it('shows an empty state when there is no experience', () => {
    render(<Experience experiences={[]} />)
    expect(screen.getByText('No experience listed yet.')).toBeInTheDocument()
  })
})
