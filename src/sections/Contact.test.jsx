import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { Contact } from './Contact'
import { createQueryWrapper } from '../test/helpers'
import { mockProfile } from '../test/mocks/handlers'
import { server } from '../test/mocks/server'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
async function fillValidForm(user) {
  await user.type(screen.getByLabelText('Name'), 'Ada Lovelace')
  await user.type(screen.getByLabelText('Email'), 'ada@example.com')
  await user.type(screen.getByLabelText('Message'), 'Hello there!')
}
describe('Contact', () => {
  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup()
    render(<Contact availableFor={[]} />, {
      wrapper: createQueryWrapper(),
    })
    await user.click(
      screen.getByRole('button', {
        name: 'Send Message',
      }),
    )
    expect(await screen.findByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
    expect(screen.getByText('Message is required')).toBeInTheDocument()
  })
  it('submits and shows a success message on valid input', async () => {
    const user = userEvent.setup()
    render(<Contact availableFor={['Full-time']} />, {
      wrapper: createQueryWrapper(),
    })
    await fillValidForm(user)
    await user.click(
      screen.getByRole('button', {
        name: 'Send Message',
      }),
    )
    expect(await screen.findByText('Thanks! Your message has been sent.')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveValue('')
  })
  it('shows an inline error when the submission fails', async () => {
    server.use(
      http.post(`${API_BASE_URL}/api/v1/contact_messages`, () =>
        HttpResponse.json(
          {
            errors: ['Email is invalid'],
          },
          {
            status: 422,
          },
        ),
      ),
    )
    const user = userEvent.setup()
    render(<Contact availableFor={[]} />, {
      wrapper: createQueryWrapper(),
    })
    await fillValidForm(user)
    await user.click(
      screen.getByRole('button', {
        name: 'Send Message',
      }),
    )
    await waitFor(() => expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument())
  })
  it('shows availability when provided', () => {
    render(<Contact availableFor={['Full-time', 'Contract']} />, {
      wrapper: createQueryWrapper(),
    })
    expect(screen.getByText('Available for Full-time & Contract')).toBeInTheDocument()
  })
  it('shows a location card when the profile has one', () => {
    render(<Contact availableFor={[]} profile={mockProfile} />, {
      wrapper: createQueryWrapper(),
    })
    expect(screen.getByText('Location')).toBeInTheDocument()
    expect(screen.getByText(mockProfile.location)).toBeInTheDocument()
  })
  it('omits the location card when there is no profile yet', () => {
    render(<Contact availableFor={[]} />, {
      wrapper: createQueryWrapper(),
    })
    expect(screen.queryByText('Location')).not.toBeInTheDocument()
  })
})
