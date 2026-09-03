import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ThemeProvider } from './ThemeProvider'
import { ThemeToggle } from './ThemeToggle'
function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  )
}
describe('ThemeToggle', () => {
  it('defaults to light theme when no preference is saved', () => {
    renderToggle()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(
      screen.getByRole('button', {
        name: /switch to dark mode/i,
      }),
    ).toBeInTheDocument()
  })
  it('toggles the theme and persists it to localStorage', async () => {
    const user = userEvent.setup()
    renderToggle()
    await user.click(
      screen.getByRole('button', {
        name: /switch to dark mode/i,
      }),
    )
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(window.localStorage.getItem('portfolio-web-theme')).toBe('dark')
    expect(
      screen.getByRole('button', {
        name: /switch to light mode/i,
      }),
    ).toBeInTheDocument()
  })
})
