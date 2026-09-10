import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { MemoryLog } from './MemoryLog'
import { createQueryWrapper } from '../test/helpers'
import { mockMemoryLog } from '../test/mocks/handlers'
import { server } from '../test/mocks/server'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

describe('MemoryLog', () => {
  it('renders the section header', () => {
    render(<MemoryLog />, { wrapper: createQueryWrapper() })
    expect(screen.getByRole('heading', { name: /leave a trace/i })).toBeInTheDocument()
    expect(screen.getByText('A note, a thought, a question. It stays.')).toBeInTheDocument()
  })

  it('shows entries in the graph', async () => {
    render(<MemoryLog />, { wrapper: createQueryWrapper() })
    expect(await screen.findByRole('img', { name: /visitor note graph/i })).toBeInTheDocument()
    // initials for "Hasan Hamadeh" (mockMemoryLog[0])
    expect(screen.getByText('HH')).toBeInTheDocument()
    expect(mockMemoryLog[0].display_name).toBe('Hasan Hamadeh')
  })

  it('shows an empty state when there are no entries', async () => {
    server.use(http.get(`${API_BASE_URL}/api/v1/memory_log_entries`, () => HttpResponse.json([])))
    render(<MemoryLog />, { wrapper: createQueryWrapper() })
    expect(await screen.findByText('No traces yet — be the first.')).toBeInTheDocument()
  })

  it('shows a load error when the query fails', async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/v1/memory_log_entries`, () => new HttpResponse(null, { status: 500 })),
    )
    render(<MemoryLog />, { wrapper: createQueryWrapper() })
    await waitFor(() => expect(screen.getByText("Couldn't load the log.")).toBeInTheDocument())
  })

  it('links the removal-request email in the disclaimer', () => {
    render(<MemoryLog email="kim@example.com" />, { wrapper: createQueryWrapper() })
    const link = screen.getByRole('link', { name: 'kim@example.com' })
    expect(link).toHaveAttribute('href', 'mailto:kim@example.com')
  })

  it('renders a <script> message as literal text, not an element', async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/v1/memory_log_entries`, () =>
        HttpResponse.json([
          { id: 'x', display_name: 'Xavier Xu', message: '<script>alert(1)</script>', created_at: new Date().toISOString() },
        ]),
      ),
    )
    const user = userEvent.setup()
    render(<MemoryLog />, { wrapper: createQueryWrapper() })
    await user.click(await screen.findByRole('button', { name: /note from Xavier Xu/i }))
    expect(await screen.findByText('<script>alert(1)</script>')).toBeInTheDocument()
    expect(document.querySelector('#memory-log script')).toBeNull()
  })

  it('requires a message', async () => {
    const user = userEvent.setup()
    render(<MemoryLog />, { wrapper: createQueryWrapper() })
    await user.click(screen.getByRole('button', { name: /log entry/i }))
    expect(await screen.findByText('Write something first')).toBeInTheDocument()
  })

  it('shows the remaining character count', async () => {
    const user = userEvent.setup()
    render(<MemoryLog />, { wrapper: createQueryWrapper() })
    await user.type(screen.getByLabelText(/leave a note/i), 'hello')
    expect(screen.getByText('275 left')).toBeInTheDocument()
  })

  it('submits a note and confirms', async () => {
    const user = userEvent.setup()
    render(<MemoryLog />, { wrapper: createQueryWrapper() })
    await user.type(screen.getByLabelText(/your name/i), 'Ada')
    await user.type(screen.getByLabelText(/leave a note/i), 'wonderful')
    await user.click(screen.getByRole('button', { name: /log entry/i }))
    expect(await screen.findByText('Trace left.')).toBeInTheDocument()
  })

  it('surfaces a server validation error', async () => {
    server.use(
      http.post(`${API_BASE_URL}/api/v1/memory_log_entries`, () =>
        HttpResponse.json({ errors: ["Message can't contain links"] }, { status: 422 }),
      ),
    )
    const user = userEvent.setup()
    render(<MemoryLog />, { wrapper: createQueryWrapper() })
    await user.type(screen.getByLabelText(/leave a note/i), 'http://a http://b')
    await user.click(screen.getByRole('button', { name: /log entry/i }))
    expect(await screen.findByText("Message can't contain links")).toBeInTheDocument()
  })

  it('shows rate-limit copy on a 429', async () => {
    server.use(
      http.post(`${API_BASE_URL}/api/v1/memory_log_entries`, () =>
        HttpResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 }),
      ),
    )
    const user = userEvent.setup()
    render(<MemoryLog />, { wrapper: createQueryWrapper() })
    await user.type(screen.getByLabelText(/leave a note/i), 'again and again')
    await user.click(screen.getByRole('button', { name: /log entry/i }))
    expect(
      await screen.findByText("You're leaving traces faster than I can read them — try again in a bit."),
    ).toBeInTheDocument()
  })

  it('has an off-screen honeypot field', () => {
    render(<MemoryLog />, { wrapper: createQueryWrapper() })
    const honeypot = document.querySelector('input[name="nickname"]')
    expect(honeypot).toBeInTheDocument()
    expect(honeypot).toHaveAttribute('aria-hidden', 'true')
    expect(honeypot).toHaveAttribute('tabindex', '-1')
  })
})
