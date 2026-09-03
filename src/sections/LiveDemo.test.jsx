import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LiveDemo } from './LiveDemo'
import { mockProfile, mockProjects, mockSkills } from '../test/mocks/handlers'
describe('LiveDemo', () => {
  it('loads the first query response automatically on mount', async () => {
    render(<LiveDemo profile={mockProfile} skills={mockSkills} projects={mockProjects} />)
    expect(await screen.findByText('200')).toBeInTheDocument()
    expect(screen.getByText(new RegExp(mockProfile.name))).toBeInTheDocument()
  })
  it('switches to another query response when clicked', async () => {
    render(<LiveDemo profile={mockProfile} skills={mockSkills} projects={mockProjects} />)
    await screen.findByText('200')
    fireEvent.click(
      screen.getByRole('button', {
        name: /skills\.top/,
      }),
    )
    await waitFor(() => {
      expect(screen.getByText(new RegExp(mockSkills[0].name))).toBeInTheDocument()
    })
    expect(screen.queryByText(new RegExp(mockProfile.name))).not.toBeInTheDocument()
  })
  it('includes a mailto link built from the real contact email in the hire query', async () => {
    render(<LiveDemo profile={mockProfile} skills={mockSkills} projects={mockProjects} />)
    await screen.findByText('200')
    fireEvent.click(
      screen.getByRole('button', {
        name: /hire\.me/,
      }),
    )
    await waitFor(() => {
      expect(screen.getByText(/accepting_inquiries/)).toBeInTheDocument()
    })
  })
  it('shows a loading placeholder for the profile query when there is no profile yet', async () => {
    render(<LiveDemo skills={[]} projects={[]} />)
    await waitFor(() => {
      expect(screen.getByText(/"loading"/)).toBeInTheDocument()
    })
  })
  it('replaces the loading placeholder once the profile arrives after mount', async () => {
    // Regression test: the profile query used to be sent (and its response
    // snapshotted into state) once on mount. If `profile` was still loading
    // at that exact instant — as it usually is, since it's an async query —
    // the panel would show "loading" forever, never picking up the real
    // data even after it arrived a moment later.
    const { rerender } = render(<LiveDemo skills={[]} projects={[]} />)
    await waitFor(() => {
      expect(screen.getByText(/"loading"/)).toBeInTheDocument()
    })
    rerender(<LiveDemo profile={mockProfile} skills={mockSkills} projects={mockProjects} />)
    await waitFor(() => {
      expect(screen.getByText(new RegExp(mockProfile.name))).toBeInTheDocument()
    })
    expect(screen.queryByText(/"loading"/)).not.toBeInTheDocument()
  })
})
