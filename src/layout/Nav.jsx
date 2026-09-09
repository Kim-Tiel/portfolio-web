import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '../theme/ThemeToggle'
import { useActiveSection } from './useActiveSection'
import { useScrolled } from './useScrolled'
const NAV_LINKS = [
  {
    id: 'home',
    label: 'Home',
  },
  {
    id: 'about',
    label: 'About',
  },
  {
    id: 'skills',
    label: 'Skills',
  },
  {
    id: 'projects',
    label: 'Projects',
  },
  {
    id: 'experience',
    label: 'Experience',
  },
]
const DOT_TRANSITION = {
  type: 'spring',
  stiffness: 380,
  damping: 30,
}

// A fixed-size invisible spacer keeps every link the same width whether or
// not it's active — the *visible* dot is a separate element stacked on top,
// only ever mounted for the active link. Because it shares one `layoutId`
// across every link, Framer Motion animates it sliding from its old
// position to its new one when `activeId` changes, instead of one dot
// fading out in place while a different one fades in elsewhere.
function NavDot({ isActive, layoutId }) {
  return (
    <span aria-hidden className="relative h-1.5 w-1.5 shrink-0">
      <span className="block h-1.5 w-1.5 rounded-full opacity-0" />
      {isActive && (
        <motion.span
          layoutId={layoutId}
          data-testid="nav-active-dot"
          className="absolute inset-0 rounded-full bg-[var(--accent)]"
          transition={DOT_TRANSITION}
        />
      )}
    </span>
  )
}
export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeId = useActiveSection(NAV_LINKS.map((link) => link.id))
  const scrolled = useScrolled()
  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
    })
    setMobileOpen(false)
  }
  return (
    <header
      className={`sticky top-0 z-50 transition-[padding] duration-500 ease-in-out ${scrolled ? 'px-4 pt-4 sm:px-6 lg:px-10' : 'px-0 pt-0'}`}
    >
      {/* mx-auto + max-w stay constant across both states (never toggled) so
          the transition only touches padding/border/background/radius —
          properties CSS can actually animate smoothly. Toggling max-width
          itself (e.g. w-full <-> max-w-7xl) can't interpolate and jumps. */}
      <div
        className={`mx-auto flex w-full max-w-[1600px] items-center justify-between transition-all duration-500 ease-in-out ${scrolled ? 'rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-6 py-6 shadow-lg shadow-black/10 [backdrop-filter:blur(24px)_saturate(180%)]' : 'rounded-none border border-transparent bg-transparent px-4 py-6 sm:px-6'}`}
      >
        <button
          type="button"
          onClick={() => scrollToSection('home')}
          className="text-lg font-semibold text-[var(--text)]"
        >
          KT.
        </button>

        <div className="hidden items-center gap-6 md:flex">
          <nav aria-label="Main" className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                aria-current={activeId === link.id ? 'true' : undefined}
                className={`flex items-center gap-2 text-base transition-colors ${activeId === link.id ? 'text-[var(--text)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
              >
                <NavDot isActive={activeId === link.id} layoutId="nav-active-dot-desktop" />
                {link.label}
              </button>
            ))}
          </nav>

          <ThemeToggle />

          <button
            type="button"
            onClick={() => scrollToSection('contact')}
            className="rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-4 py-2 text-sm font-medium text-white"
          >
            Get In Touch
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="inline-flex h-9 w-9 items-center justify-center text-[var(--text)]"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Mobile"
          className="mx-auto mt-2 flex max-w-7xl flex-col gap-1 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-6 py-3 shadow-lg shadow-black/10 [backdrop-filter:blur(24px)_saturate(180%)] md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToSection(link.id)}
              aria-current={activeId === link.id ? 'true' : undefined}
              className={`flex items-center gap-2 rounded px-3 py-2 text-left text-base transition-colors ${activeId === link.id ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'}`}
            >
              <NavDot isActive={activeId === link.id} layoutId="nav-active-dot-mobile" />
              {link.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => scrollToSection('contact')}
            className="mt-2 rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-4 py-2 text-center text-sm font-medium text-white"
          >
            Get In Touch
          </button>
        </nav>
      )}
    </header>
  )
}
