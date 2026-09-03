import { motion } from 'framer-motion'
import { Download, LayoutGrid, Mail } from 'lucide-react'
import { useTypewriter } from './useTypewriter'
import { useCursorSpotlight } from '../hooks/useCursorSpotlight'
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL

// TODO: swap these placeholders for the real profile URLs.
const GITHUB_URL = '#'
const LINKEDIN_URL = '#'

// Cycled by the typewriter effect below the name — built from the real
// skills in the backend rather than invented tech.
const ROLE_LINES = ['Full-Stack Developer | Ruby on Rails | React.js | Vue.js']
function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.42.36.78 1.08.78 2.18 0 1.58-.01 2.85-.01 3.24 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  )
}
function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={18} height={18} aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.44v6.3ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  )
}
export function Intro({ profile }) {
  const roleLine = useTypewriter(ROLE_LINES)
  const { spotlightRef, handleMouseMove } = useCursorSpotlight()
  return (
    // min-h-screen would be a full 100vh *below* the sticky nav's own
    // ~86px, pushing the bottom content (the social row) past the fold.
    // Netting out the nav's height here is what makes everything —
    // including "Find Me On" — actually fit within one screen.
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[calc(100vh-90px)] flex-col items-center justify-between overflow-hidden px-4 pt-24 pb-8 text-center sm:pt-28"
    >
      {/* Ambient background — a couple of fixed, softly blurred blobs in
          our accent colors, plus a glow that eases toward the pointer.
          Matches the reference site's textured background instead of a
          flat single-color one. */}
      {/* Both blobs stay well clear of the section's own edges — a blob
          clipped by overflow-hidden right at a section boundary leaves a
          hard flat edge where the soft blur should be, a visible seam
          against the section below it. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute top-[5%] left-[15%] h-80 w-80 rounded-full bg-[var(--accent-from)]/20 blur-[110px]" />
        <div className="absolute right-[10%] bottom-[20%] h-96 w-96 rounded-full bg-[var(--accent-to)]/15 blur-[120px]" />
      </div>
      <div
        ref={spotlightRef}
        aria-hidden
        data-testid="cursor-spotlight"
        className="pointer-events-none absolute top-[15%] left-[70%] -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-from)]/20 opacity-0 blur-[110px] transition-[left,top,opacity] duration-500 ease-out"
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex items-center gap-3 text-sm uppercase tracking-widest text-[var(--text-muted)]"
        >
          <span className="font-mono text-[var(--accent)]">00</span>
          <span className="h-px w-8 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]" />
          <span>Introduction</span>
        </motion.div>

        {profile.available_for.length > 0 && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-1.5 text-xs uppercase tracking-widest text-[var(--text-muted)] shadow-lg shadow-black/10 [backdrop-filter:blur(24px)_saturate(180%)]">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Available for {profile.available_for.join(' & ')}
          </p>
        )}

        <motion.h1
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="mt-6 text-5xl font-bold text-[var(--text)] sm:text-7xl"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          initial={{
            opacity: 0,
            y: 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
          }}
          className="mt-2 text-xl text-[var(--accent)]"
          aria-label={profile.title}
        >
          {roleLine}
          <span className="typewriter-cursor ml-0.5 inline-block h-[1.1em] w-px translate-y-[0.15em] bg-current align-middle" />
        </motion.p>

        {profile.hero_tagline && (
          <motion.p
            initial={{
              opacity: 0,
              y: 16,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="mt-6 max-w-xl text-[var(--text-muted)]"
          >
            {profile.hero_tagline}
          </motion.p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-6 py-3 text-sm font-medium text-white"
          >
            Resume
            <Download size={16} />
          </a>
          <button
            type="button"
            onClick={() =>
              document.getElementById('projects')?.scrollIntoView({
                behavior: 'smooth',
              })
            }
            className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-6 py-3 text-sm font-medium text-[var(--text)] shadow-lg shadow-black/10 [backdrop-filter:blur(24px)_saturate(180%)]"
          >
            View My Work
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Find Me On</p>
        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
          >
            <GithubIcon />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
          >
            <LinkedinIcon />
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            aria-label="Email"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}
