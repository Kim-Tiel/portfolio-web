import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryGraph } from './MemoryGraph'

const entries = [
  { id: 'a', display_name: 'Omar Al-Hamwi', message: 'This work speaks volumes.', created_at: '2026-06-30T10:00:00Z' },
  { id: 'b', display_name: 'Hasan Hamadeh', message: 'Keep going!', created_at: '2026-07-01T10:00:00Z' },
  { id: 'c', display_name: 'Anonymous', message: 'Clean.', created_at: '2026-07-02T10:00:00Z' },
]

function setReducedMotion(reduce) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: reduce && query.includes('reduced-motion'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))
}

afterEach(() => setReducedMotion(false))

describe('MemoryGraph', () => {
  it('renders a node per entry with initials', () => {
    setReducedMotion(false)
    render(<MemoryGraph entries={entries} />)
    expect(screen.getByRole('img', { name: /visitor note graph/i })).toBeInTheDocument()
    expect(screen.getByText('OA')).toBeInTheDocument()
    expect(screen.getByText('HH')).toBeInTheDocument()
    expect(screen.getByText('AN')).toBeInTheDocument()
  })

  it('opens and closes a note card when a node is clicked', async () => {
    setReducedMotion(false)
    const user = userEvent.setup()
    render(<MemoryGraph entries={entries} />)
    await user.click(screen.getByRole('button', { name: /note from Omar Al-Hamwi/i }))
    expect(await screen.findByText('This work speaks volumes.')).toBeInTheDocument()
    expect(screen.getByText('Jun 30, 2026')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /close note/i }))
    expect(screen.queryByText('This work speaks volumes.')).not.toBeInTheDocument()
  })

  it('has a reset-view control', () => {
    setReducedMotion(false)
    render(<MemoryGraph entries={entries} />)
    expect(screen.getByRole('button', { name: /reset view/i })).toBeInTheDocument()
  })

  it('always exposes every note in a screen-reader list', () => {
    setReducedMotion(false)
    render(<MemoryGraph entries={entries} />)
    const srList = screen.getByRole('list', { name: /all visitor notes/i })
    expect(srList).toBeInTheDocument()
    expect(srList.querySelectorAll('li')).toHaveLength(3)
  })

  it('falls back to a plain card list when reduced motion is preferred', () => {
    setReducedMotion(true)
    render(<MemoryGraph entries={entries} />)
    expect(screen.queryByRole('img', { name: /visitor note graph/i })).not.toBeInTheDocument()
    expect(screen.getByText('This work speaks volumes.')).toBeInTheDocument()
    expect(screen.getByText('Keep going!')).toBeInTheDocument()
  })
})
