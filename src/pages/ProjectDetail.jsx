import { ArrowLeft, Code2, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useProjectQuery } from '../api/projects'
import { ThemeToggle } from '../theme/ThemeToggle'
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
export function ProjectDetail() {
  const { slug } = useParams()
  const { data: project, isLoading, isError } = useProjectQuery(slug)
  return (
    <main>
      <header className="border-b border-[var(--border)] px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
          >
            <ArrowLeft size={16} />
            Back to projects
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {isLoading && <p className="px-4 py-24 text-center text-[var(--text-muted)]">Loading…</p>}
      {isError && <p className="px-4 py-24 text-center text-[var(--text-muted)]">Could not load this project.</p>}

      {project && (
        <article className="mx-auto max-w-3xl px-4 py-16">
          <span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
            {STATUS_LABELS[project.status]}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-[var(--text)] sm:text-4xl">{project.title}</h1>

          <p className="mt-4 text-sm text-[var(--text-muted)]">
            {[project.client_type, project.location, formatDateRange(project.started_on, project.completed_on)]
              .filter(Boolean)
              .join(' · ')}
          </p>

          {project.image_url && (
            <img
              src={project.image_url}
              alt={project.title}
              className="mt-8 w-full rounded-2xl border border-[var(--border)] object-cover"
            />
          )}

          {(project.site_url || project.repo_url) && (
            <div className="mt-8 flex flex-wrap gap-4">
              {project.site_url && (
                <a
                  href={project.site_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-5 py-2.5 text-sm font-medium text-white"
                >
                  <ExternalLink size={16} />
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
                  <Code2 size={16} />
                  View Code
                </a>
              )}
            </div>
          )}

          <p className="mt-10 whitespace-pre-line text-[var(--text-muted)]">{project.description ?? project.summary}</p>

          {project.metrics.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{metric.label}</dt>
                  <dd className="mt-1 text-2xl font-semibold text-[var(--text)]">{metric.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {project.skills.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Tech Stack</h2>
              <div className="mt-4 flex flex-wrap gap-2">
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
        </article>
      )}
    </main>
  )
}
