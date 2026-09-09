import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Code2, ExternalLink, X } from 'lucide-react'
const STATUS_LABELS = {
  live: 'Live',
  in_progress: 'In Progress',
  archived: 'Archived',
}
function formatDateRange(startedOn, completedOn) {
  if (!startedOn && !completedOn) return null
  const start = startedOn ? new Date(startedOn).getFullYear() : null
  const end = completedOn ? new Date(completedOn).getFullYear() : 'Present'
  return start ? `${start} — ${end}` : String(end)
}

// All the info a project card doesn't have room for — same content the
// old /projects/:slug page used to show, now surfaced in place instead of
// navigating away from the grid.
export function ProjectModal({ project, onClose }) {
  // Escape closes the modal, and background scroll is locked while it's
  // open so scrolling the (fixed, overlaid) modal doesn't also scroll the
  // page behind it.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const meta = [project.client_type, project.location, formatDateRange(project.started_on, project.completed_on)]
    .filter(Boolean)
    .join(' · ')

  return (
    <div role="dialog" aria-modal="true" aria-label={project.title} className="fixed inset-0 z-50 flex p-4">
      <motion.div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{
          duration: 0.2,
        }}
      />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.95,
          y: 20,
        }}
        transition={{
          duration: 0.25,
          ease: 'easeOut',
        }}
        className="relative m-auto max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 text-left shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text)]"
        >
          <X aria-hidden size={18} />
        </button>

        <span className="text-xs tracking-widest text-[var(--text-muted)] uppercase">
          {STATUS_LABELS[project.status]}
        </span>
        <h2 className="mt-2 pr-10 text-2xl font-bold text-[var(--text)] sm:text-3xl">{project.title}</h2>

        {meta && <p className="mt-2 text-sm text-[var(--text-muted)]">{meta}</p>}

        {project.image_url && (
          <img
            src={project.image_url}
            alt={project.title}
            className="mt-6 w-full rounded-xl border border-[var(--border)] object-cover"
          />
        )}

        {(project.site_url || project.repo_url) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.site_url && (
              <a
                href={project.site_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-5 py-2.5 text-sm font-medium text-white"
              >
                <ExternalLink aria-hidden size={16} />
                Visit Site
              </a>
            )}
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text)]"
              >
                <Code2 aria-hidden size={16} />
                View Code
              </a>
            )}
          </div>
        )}

        <p className="mt-6 whitespace-pre-line text-[var(--text-muted)]">{project.description ?? project.summary}</p>

        {project.metrics.length > 0 && (
          <dl className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <dt className="text-xs tracking-widest text-[var(--text-muted)] uppercase">{metric.label}</dt>
                <dd className="mt-1 text-xl font-semibold text-[var(--text)]">{metric.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {project.skills.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs tracking-widest text-[var(--text-muted)] uppercase">Tech Stack</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--text-muted)]"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
