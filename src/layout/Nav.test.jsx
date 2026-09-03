import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../theme/ThemeProvider'
import { Nav } from './Nav'

// A capturing IntersectionObserver mock — lets tests manually fire the
// callback to simulate a section scrolling into view, instead of the no-op
// global stub in test/setup.ts (which never calls back at all). Also
// records which elements were actually `observe()`'d, so a test can prove
// a late-mounting section gets picked up rather than just asserting on a
// manually-fired callback (which would pass even if nothing observed it).
let capturedCallback = null
let observedElements = []
class CapturingIntersectionObserver {
  root = null
  rootMargin = ''
  scrollMargin = ''
  thresholds = []
  constructor(callback) {
    capturedCallback = callback
  }
  observe(target) {
    observedElements.push(target)
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
function renderNav() {
  // Sections the nav's scroll-spy observes must exist in the DOM for the
  // hook to attach observers at all.
  document.body.innerHTML = `
    <div id="home"></div>
    <div id="about"></div>
    <div id="skills"></div>
    <div id="projects"></div>
    <div id="experience"></div>
    <div id="contact"></div>
  `
  const container = document.createElement('div')
  document.body.appendChild(container)
  return render(
    <ThemeProvider>
      <Nav />
    </ThemeProvider>,
    {
      container,
    },
  )
}
describe('Nav', () => {
  const originalIO = window.IntersectionObserver
  beforeEach(() => {
    window.IntersectionObserver = CapturingIntersectionObserver
  })
  afterEach(() => {
    window.IntersectionObserver = originalIO
    capturedCallback = null
    observedElements = []
    document.body.innerHTML = ''
  })
  it('renders the logo and desktop nav links', () => {
    renderNav()
    expect(
      screen.getByRole('button', {
        name: 'KT.',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'About',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Get In Touch',
      }),
    ).toBeInTheDocument()
  })
  it('scrolls to the matching section when a nav link is clicked', async () => {
    const user = userEvent.setup()
    renderNav()
    const aboutSection = document.getElementById('about')
    const scrollSpy = vi.fn()
    aboutSection.scrollIntoView = scrollSpy
    await user.click(
      screen.getByRole('button', {
        name: 'About',
      }),
    )
    expect(scrollSpy).toHaveBeenCalledWith({
      behavior: 'smooth',
    })
  })
  it('toggles the mobile menu open and closed', async () => {
    const user = userEvent.setup()
    renderNav()
    const openButton = screen.getByRole('button', {
      name: /open menu/i,
    })
    await user.click(openButton)
    expect(
      screen.getByRole('navigation', {
        name: 'Mobile',
      }),
    ).toBeInTheDocument()
    await user.click(
      screen.getByRole('button', {
        name: /close menu/i,
      }),
    )
    expect(
      screen.queryByRole('navigation', {
        name: 'Mobile',
      }),
    ).not.toBeInTheDocument()
  })
  it('highlights the nav link for the section currently in view', () => {
    renderNav()
    const aboutButton = screen.getByRole('button', {
      name: 'About',
    })
    expect(aboutButton).not.toHaveAttribute('aria-current')

    // Simulate the "about" section crossing the scroll-spy's viewport band.
    act(() => {
      capturedCallback?.(
        [
          {
            isIntersecting: true,
            target: document.getElementById('about'),
          },
        ],
        {},
      )
    })
    expect(aboutButton).toHaveAttribute('aria-current', 'true')
  })
  it('fades in the active-link dot instead of showing it on every link', () => {
    renderNav()
    const aboutButton = screen.getByRole('button', {
      name: 'About',
    })
    const homeButton = screen.getByRole('button', {
      name: 'Home',
    })
    const dotIn = (button) => button.querySelector('span[aria-hidden]')
    expect(dotIn(aboutButton)).toHaveClass('opacity-0')
    act(() => {
      capturedCallback?.(
        [
          {
            isIntersecting: true,
            target: document.getElementById('about'),
          },
        ],
        {},
      )
    })
    expect(dotIn(aboutButton)).toHaveClass('opacity-100')
    expect(dotIn(homeButton)).toHaveClass('opacity-0')
  })
  it('starts tracking a section that mounts after the nav does', async () => {
    // Regression test: "home" and "about" render conditionally once the
    // profile query resolves (see Home.tsx), so they don't exist in the DOM
    // yet when Nav — rendered unconditionally — first mounts and sets up
    // its scroll-spy. Without picking up late-mounted sections, the nav
    // would never observe "home" or "about" at all, so their link never
    // highlights no matter what the user scrolls to.
    document.body.innerHTML = `
      <div id="skills"></div>
      <div id="projects"></div>
      <div id="experience"></div>
      <div id="contact"></div>
    `
    const container = document.createElement('div')
    document.body.appendChild(container)
    render(
      <ThemeProvider>
        <Nav />
      </ThemeProvider>,
      {
        container,
      },
    )
    expect(observedElements.some((el) => el.id === 'home')).toBe(false)

    // The profile query "resolves" and Home/About mount.
    const homeSection = document.createElement('div')
    homeSection.id = 'home'
    document.body.appendChild(homeSection)
    await waitFor(() => {
      expect(observedElements.some((el) => el.id === 'home')).toBe(true)
    })
  })
})
