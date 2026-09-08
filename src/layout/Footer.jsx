import { motion } from 'framer-motion'
import { ChevronUp, FileText, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useScrolled } from './useScrolled'
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL

// TODO: swap these placeholders for the real profile URLs (matches Intro.tsx).
const GITHUB_URL = '#'
const LINKEDIN_URL = '#'
const QUICK_LINKS = [
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
  {
    id: 'contact',
    label: 'Contact',
  },
]
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
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
  })
}
function uniqueSkillNames(skills) {
  return Array.from(new Set(skills.map((skill) => skill.name)))
}
export function Footer({ profile, projects, skills }) {
  // Reuses the nav's "past a threshold" scroll tracker with a much taller
  // threshold — the button should only appear once there's meaningfully far
  // to scroll back up, not the moment the page moves at all.
  const scrolledFar = useScrolled(400)
  const featured = projects.filter((project) => project.is_featured)
  const featuredProjects = (featured.length > 0 ? featured : projects).slice(0, 5)
  const techStack = uniqueSkillNames(skills)
  return (
    <>
      <footer className="border-t border-[var(--border)] bg-[var(--bg-alt)] px-4 py-16">
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
          className="mx-auto max-w-6xl"
        >
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <span className="text-lg font-semibold text-[var(--text)]">KT.</span>

              {profile?.hero_tagline && (
                <p className="mt-4 max-w-xs text-sm text-[var(--text-muted)]">{profile.hero_tagline}</p>
              )}

              <div className="mt-5 space-y-2 text-sm">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-2 text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
                >
                  <Mail size={16} aria-hidden />
                  {CONTACT_EMAIL}
                </a>
                {profile?.location && (
                  <p className="flex items-center gap-2 text-[var(--text-muted)]">
                    <MapPin size={16} aria-hidden />
                    {profile.location}
                  </p>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <div className="flex items-center gap-3 text-xs tracking-widest uppercase">
                <span className="font-mono text-[var(--accent)]">A</span>
                <span className="h-px w-6 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]" />
                <span className="text-[var(--text-muted)]">Quick Links</span>
              </div>
              <ul className="mt-5 space-y-3">
                {QUICK_LINKS.map((link, index) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(link.id)}
                      className="flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                    >
                      <span className="font-mono text-xs text-[var(--accent)]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Featured work */}
            {featuredProjects.length > 0 && (
              <div>
                <div className="flex items-center gap-3 text-xs tracking-widest uppercase">
                  <span className="font-mono text-[var(--accent)]">B</span>
                  <span className="h-px w-6 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]" />
                  <span className="text-[var(--text-muted)]">Featured Work</span>
                </div>
                <ul className="mt-5 space-y-3">
                  {featuredProjects.map((project) => (
                    <li key={project.id}>
                      <Link
                        to={`/projects/${project.slug}`}
                        className="text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                      >
                        {project.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech stack + connect */}
            <div>
              {techStack.length > 0 && (
                <>
                  <div className="flex items-center gap-3 text-xs tracking-widest uppercase">
                    <span className="font-mono text-[var(--accent)]">C</span>
                    <span className="h-px w-6 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]" />
                    <span className="text-[var(--text-muted)]">Tech Stack</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {techStack.map((name) => (
                      <span
                        key={name}
                        className="rounded-md border border-[var(--border)] px-2 py-1 font-mono text-[10px] text-[var(--text-muted)] uppercase"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-8 flex items-center gap-3 text-xs tracking-widest uppercase">
                <span className="font-mono text-[var(--accent)]">D</span>
                <span className="h-px w-6 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]" />
                <span className="text-[var(--text-muted)]">Connect</span>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
                >
                  <GithubIcon />
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
                >
                  <LinkedinIcon />
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  aria-label="Email"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
                >
                  <Mail size={16} />
                </a>
                <a
                  href="/resume.pdf"
                  download
                  aria-label="Resume"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
                >
                  <FileText size={16} />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-2 border-t border-[var(--border)] pt-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {profile?.name ?? 'Portfolio'}. All rights reserved.
            </p>
            {profile && (
              <p>
                {profile.title}
                {profile.available_for.length > 0 && (
                  <>
                    {' '}
                    <span aria-hidden>·</span> Available for {profile.available_for.join(' & ')}
                  </>
                )}
              </p>
            )}
          </div>
        </motion.div>
      </footer>

      <button
        type="button"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }
        aria-label="Scroll to top"
        className={`fixed right-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white shadow-lg transition-all duration-300 active:scale-[0.94] ${scrolledFar ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <ChevronUp size={20} />
      </button>
    </>
  )
}
