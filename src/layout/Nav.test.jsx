import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../theme/ThemeProvider'
import { Nav } from './Nav'

// Simulates a section having scrolled to a given position by stubbing its
// `getBoundingClientRect`, then firing the `scroll` event the hook listens
// for. The hook schedules its recompute on a rAF, so callers await the
// resulting assertion instead of checking synchronously.
function setSectionTop(id, top) {
  const element = document.getElementById(id)
  element.getBoundingClientRect = () => ({
    top,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
  })
}
function fireScroll() {
  act(() => {
    window.dispatchEvent(new Event('scroll'))
  })
}
function renderNav() {
  // Sections the nav's scroll-spy tracks must exist in the DOM for the hook
  // to measure them at all. Spread out well above the default "active
  // line" so the initial computation doesn't just land on the last one.
  document.body.innerHTML = `
    <div id="home"></div>
    <div id="about"></div>
    <div id="skills"></div>
    <div id="projects"></div>
    <div id="experience"></div>
    <div id="live-demo"></div>
    <div id="memory-log"></div>
    <div id="contact"></div>
  `
  ;['home', 'about', 'skills', 'projects', 'experience', 'live-demo', 'memory-log'].forEach((id) =>
    setSectionTop(id, 900),
  )
  setSectionTop('home', -900)
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
  afterEach(() => {
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
        name: 'Experience',
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
  it('highlights the nav link for the section currently in view', async () => {
    renderNav()
    const aboutButton = screen.getByRole('button', {
      name: 'About',
    })
    expect(aboutButton).not.toHaveAttribute('aria-current')

    // Simulate scrolling until "about"'s top has passed the active line.
    setSectionTop('about', 50)
    fireScroll()

    await waitFor(() => {
      expect(aboutButton).toHaveAttribute('aria-current', 'true')
    })
  })
  it('picks the right section even when a shorter one sits between two tall ones', async () => {
    // Regression test: a thin-band intersection observer can get stuck on
    // whichever section it saw last if a shorter section between two much
    // taller ones never crosses the band. Recomputing from live geometry on
    // every scroll shouldn't have that problem — "experience" should
    // highlight correctly even though "projects" (rendered right before
    // it) is a much taller section.
    renderNav()
    const projectsButton = screen.getByRole('button', {
      name: 'Projects',
    })
    const experienceButton = screen.getByRole('button', {
      name: 'Experience',
    })

    // Deep into a long "projects" section — still the active one.
    setSectionTop('projects', -2000)
    setSectionTop('experience', 900)
    fireScroll()
    await waitFor(() => {
      expect(projectsButton).toHaveAttribute('aria-current', 'true')
    })

    // Scrolled past into "experience" — now that one should take over.
    setSectionTop('projects', -3200)
    setSectionTop('experience', 50)
    fireScroll()
    await waitFor(() => {
      expect(experienceButton).toHaveAttribute('aria-current', 'true')
    })
    expect(projectsButton).not.toHaveAttribute('aria-current')
  })
  it('morphs the last nav slot through the off-menu tail sections', async () => {
    renderNav()
    // Defaults to "Experience" before you scroll into that stretch.
    expect(screen.getByRole('button', { name: 'Experience' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Live Demo' })).not.toBeInTheDocument()

    setSectionTop('experience', -2000)
    setSectionTop('live-demo', 50)
    fireScroll()
    await waitFor(() => {
      const tail = screen.getByRole('button', { name: 'Live Demo' })
      expect(tail).toHaveAttribute('aria-current', 'true')
    })
    expect(screen.queryByRole('button', { name: 'Experience' })).not.toBeInTheDocument()

    setSectionTop('live-demo', -2000)
    setSectionTop('memory-log', 50)
    fireScroll()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Memory Log' })).toHaveAttribute('aria-current', 'true')
    })
  })
  it('scrolls to whichever tail section the last slot currently shows', async () => {
    const user = userEvent.setup()
    renderNav()
    setSectionTop('experience', -2000)
    setSectionTop('live-demo', 50)
    fireScroll()
    const tail = await screen.findByRole('button', { name: 'Live Demo' })
    const scrollSpy = vi.fn()
    document.getElementById('live-demo').scrollIntoView = scrollSpy
    await user.click(tail)
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' })
  })
  it('renders exactly one sliding active-dot, on the active link', async () => {
    renderNav()
    const homeButton = screen.getByRole('button', {
      name: 'Home',
    })
    const aboutButton = screen.getByRole('button', {
      name: 'About',
    })

    expect(homeButton.querySelector('[data-testid="nav-active-dot"]')).toBeInTheDocument()
    expect(aboutButton.querySelector('[data-testid="nav-active-dot"]')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('nav-active-dot')).toHaveLength(1)

    setSectionTop('about', 50)
    fireScroll()

    await waitFor(() => {
      expect(aboutButton.querySelector('[data-testid="nav-active-dot"]')).toBeInTheDocument()
    })
    expect(homeButton.querySelector('[data-testid="nav-active-dot"]')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('nav-active-dot')).toHaveLength(1)
  })
  it('starts tracking a section that mounts after the nav does', async () => {
    // Regression test: "home" and "about" render conditionally once the
    // profile query resolves (see Home.jsx), so they don't exist in the DOM
    // yet when Nav — rendered unconditionally — first mounts. Without
    // re-checking once they mount, the nav would never highlight them no
    // matter what the user scrolls to.
    document.body.innerHTML = `
      <div id="skills"></div>
      <div id="projects"></div>
      <div id="experience"></div>
      <div id="contact"></div>
    `
    ;['skills', 'projects', 'experience'].forEach((id) => setSectionTop(id, 900))
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

    // The profile query "resolves" and Home mounts, already scrolled to.
    const homeSection = document.createElement('div')
    homeSection.id = 'home'
    homeSection.getBoundingClientRect = () => ({
      top: 50,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
    })
    document.body.appendChild(homeSection)

    await waitFor(() => {
      expect(
        screen.getByRole('button', {
          name: 'Home',
        }),
      ).toHaveAttribute('aria-current', 'true')
    })
  })
})
