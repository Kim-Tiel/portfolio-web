import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, LayoutGrid } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCursorSpotlight } from '../hooks/useCursorSpotlight'
const ALL_FILTER = 'All'
const INITIAL_VISIBLE_COUNT = 6
const LOAD_MORE_COUNT = 3

// Cards fade/lift in one after another (not all at once) each time the
// filter changes — same treatment as the Skills category tabs.
const GRID_VARIANTS = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}
const CARD_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
}
const STATUS_LABELS = {
  live: 'Live',
  in_progress: 'In Progress',
  archived: 'Archived',
}
function uniqueSkillNames(projects) {
  const names = new Set()
  for (const project of projects) {
    for (const skill of project.skills) {
      names.add(skill.name)
    }
  }
  return Array.from(names).sort()
}
function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14} aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.42.36.78 1.08.78 2.18 0 1.58-.01 2.85-.01 3.24 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  )
}
export function Projects({ projects }) {
  const { spotlightRef, handleMouseMove } = useCursorSpotlight()
  const [activeFilter, setActiveFilter] = useState(ALL_FILTER)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const filters = useMemo(() => [ALL_FILTER, ...uniqueSkillNames(projects)], [projects])
  const filteredProjects =
    activeFilter === ALL_FILTER
      ? projects
      : projects.filter((project) => project.skills.some((skill) => skill.name === activeFilter))
  const visibleProjects = filteredProjects.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProjects.length
  function selectFilter(filter) {
    setActiveFilter(filter)
    // A filter narrows the set of matching projects, so "6 shown" should
    // mean the first 6 of *this* filter, not wherever the count happened
    // to land under the previous one.
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }
  return (
    <section id="projects" onMouseMove={handleMouseMove} className="relative overflow-hidden px-4 py-24">
      <div
        ref={spotlightRef}
        aria-hidden
        data-testid="cursor-spotlight"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-from)]/20 opacity-0 blur-[110px] transition-[left,top,opacity] duration-500 ease-out"
      />

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
        className="relative z-10 mx-auto max-w-6xl text-center"
      >
        <div className="flex items-center justify-center gap-3 text-sm tracking-widest text-[var(--text-muted)] uppercase">
          <span className="font-mono text-[var(--accent)]">03</span>
          <span className="h-px w-8 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]" />
          <span>Projects</span>
        </div>

        <h2 className="mt-2 text-4xl font-bold text-[var(--text)] sm:text-5xl">
          My{' '}
          <span className="bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-transparent italic">
            projects
          </span>
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-[var(--text-muted)]">
          Selected projects demonstrating practical solutions and well-architected digital experiences.
        </p>

        {filters.length > 1 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => selectFilter(filter)}
                aria-pressed={activeFilter === filter}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${activeFilter === filter ? 'border-transparent bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white' : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        <motion.div
          // Remounts (and re-plays the staggered entrance below) each time
          // the filter changes, since `key` changes with `activeFilter`.
          key={activeFilter}
          variants={GRID_VARIANTS}
          initial="hidden"
          animate="show"
          className="mt-10 grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3"
        >
          {visibleProjects.map((project, index) => (
            <motion.div key={project.id} variants={CARD_VARIANTS} className="group relative">
              {/* Sits behind the card, offset down-right — revealed on
                  hover, matching the same offset-outline treatment used
                  on the About section's photo card. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-2 -bottom-2 h-full w-full rounded-2xl border border-[var(--accent)]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-alt)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[var(--accent)]">
                {/* The whole card navigates to the project's detail page —
                    laid underneath everything else so the site/repo links
                    (real <a> tags below) can still be clicked independently
                    without nesting an anchor inside an anchor. */}
                <Link to={`/projects/${project.slug}`} aria-label={project.title} className="absolute inset-0 z-0" />

                {/* Preview image, with a placeholder for projects that don't
                  have one yet — the tech stack only reveals over it on
                  hover, matching the reference's reveal-on-hover treatment
                  instead of always crowding the card. */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--border)]">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[var(--text-muted)]">
                      <LayoutGrid aria-hidden size={28} />
                    </div>
                  )}

                  {project.skills.length > 0 && (
                    <div className="absolute inset-x-0 bottom-0 flex translate-y-2 flex-wrap gap-1.5 bg-gradient-to-t from-black/85 to-transparent p-3 pt-8 opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                      {project.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill.id}
                          className="rounded-md border border-white/20 bg-black/40 px-2 py-0.5 font-mono text-[10px] text-white uppercase"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative flex flex-1 flex-col p-6">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-2 right-4 font-mono text-7xl font-bold text-[var(--border)] select-none"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="relative flex items-center gap-3 text-xs tracking-widest text-[var(--text-muted)] uppercase">
                    <span className="h-px w-6 bg-[var(--border)] transition-colors duration-300 group-hover:bg-gradient-to-r group-hover:from-[var(--accent-from)] group-hover:to-[var(--accent-to)]" />
                    <span>Case · {STATUS_LABELS[project.status]}</span>
                  </div>
                  <h3 className="relative mt-2 text-lg font-semibold text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
                    {project.title}
                  </h3>
                  <p className="relative mt-2 flex-1 text-sm text-[var(--text-muted)]">{project.summary}</p>

                  <div className="relative mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4 text-xs tracking-widest text-[var(--text-muted)] uppercase">
                    <span className="flex items-center gap-1">
                      View Case <ArrowRight aria-hidden size={14} />
                    </span>
                    <span className="z-10 flex items-center gap-3">
                      {project.site_url && (
                        <a
                          href={project.site_url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Visit ${project.title}`}
                          className="transition-colors hover:text-[var(--accent)]"
                        >
                          <ExternalLink aria-hidden size={14} />
                        </a>
                      )}
                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${project.title} source code`}
                          className="transition-colors hover:text-[var(--accent)]"
                        >
                          <GithubIcon />
                        </a>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredProjects.length === 0 && (
          <p className="mt-10 text-[var(--text-muted)]">
            {projects.length === 0 ? 'No projects yet.' : 'No projects match this filter.'}
          </p>
        )}

        {hasMore && (
          <button
            type="button"
            onClick={() => setVisibleCount((count) => Math.min(count + LOAD_MORE_COUNT, filteredProjects.length))}
            className="mx-auto mt-10 flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
          >
            View More
            <span className="font-mono text-xs text-[var(--text-muted)]">
              ({visibleProjects.length}/{filteredProjects.length})
            </span>
          </button>
        )}
      </motion.div>
    </section>
  )
}
