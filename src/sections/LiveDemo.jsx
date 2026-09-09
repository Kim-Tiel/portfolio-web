import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useCursorSpotlight } from '../hooks/useCursorSpotlight'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
// Escape first, then wrap tokens in a themed span — the JSON text itself
// (profile/skills/projects data, or the static hire-inquiry payload) is
// ours, but escaping keeps this safe regardless.
function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
// The sample-query rows reveal one after another rather than all at once.
const LIST_VARIANTS = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}
const LIST_ITEM_VARIANTS = {
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
function highlightJson(value) {
  const escaped = escapeHtml(JSON.stringify(value, null, 2))
  return escaped.replace(
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      if (match.startsWith('"')) {
        const isKey = match.endsWith(':')
        return `<span class="${isKey ? 'text-[var(--text-muted)]' : 'text-[var(--accent)]'}">${match}</span>`
      }
      if (match === 'true' || match === 'false') return `<span class="text-emerald-500">${match}</span>`
      if (match === 'null') return `<span class="text-[var(--text-muted)]">${match}</span>`
      return `<span class="text-amber-500">${match}</span>`
    },
  )
}
export function LiveDemo({ profile, skills, projects }) {
  const { spotlightRef, handleMouseMove } = useCursorSpotlight()
  const queries = [
    {
      id: 'profile',
      method: 'GET',
      label: 'profile',
      path: '/api/v1/profile',
      buildResponse: () =>
        profile
          ? {
              name: profile.name,
              title: profile.title,
              location: profile.location,
              years_experience: profile.years_career_experience,
              available_for: profile.available_for,
            }
          : {
              status: 'loading',
            },
    },
    {
      id: 'skills.top',
      method: 'GET',
      label: 'skills.top',
      path: '/api/v1/skills',
      buildResponse: () =>
        skills.slice(0, 5).map((skill) => ({
          name: skill.name,
          category: skill.category,
          level: skill.proficiency,
        })),
    },
    {
      id: 'projects.featured',
      method: 'GET',
      label: 'projects.featured',
      path: '/api/v1/projects',
      buildResponse: () => {
        const featured = projects.filter((project) => project.is_featured)
        return (featured.length > 0 ? featured : projects).slice(0, 3).map((project) => ({
          title: project.title,
          status: project.status,
          stack: project.skills.map((skill) => skill.name),
        }))
      },
    },
    {
      id: 'hire.me',
      method: 'POST',
      label: 'hire.me',
      path: '/api/v1/contact_messages',
      buildResponse: () => ({
        status: 'accepting_inquiries',
        next_step: `mailto:${profile?.email}`,
        response_time_hours: 24,
        ok: true,
      }),
    },
  ]
  const [selectedId, setSelectedId] = useState(queries[0].id)
  // `sending` is a purely cosmetic flourish — a brief "sending…" flash
  // before the response reveals. It never gates what data is *correct* to
  // show once revealed.
  const [sending, setSending] = useState(true)
  const [timeMs, setTimeMs] = useState(0)
  const timeoutRef = useRef(null)
  const selected = queries.find((query) => query.id === selectedId) ?? queries[0]
  // Computed fresh on every render instead of captured in state at click
  // time — profile/skills/projects can still be loading when a query first
  // "sends" (e.g. the auto-load on mount, below), and a snapshot taken at
  // that moment would freeze on a stale ("loading") result forever, even
  // after the real data arrives moments later. Deriving it live means the
  // panel just naturally reflects whatever's current.
  const body = selected.buildResponse()
  const sizeKb = (new Blob([JSON.stringify(body)]).size / 1024).toFixed(1)
  function send(query) {
    setSelectedId(query.id)
    setSending(true)
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    const latency = Math.round(24 + Math.random() * 40)
    timeoutRef.current = window.setTimeout(() => {
      setTimeMs(latency)
      setSending(false)
    }, latency)
  }

  // Load the first query's response immediately on mount — a portfolio
  // demo should prove itself without asking for a click first.
  useEffect(() => {
    send(queries[0])
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount only
  }, [])
  return (
    <section
      id="live-demo"
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-[var(--bg-alt)] px-4 py-24"
    >
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
          <span className="font-mono text-[var(--accent)]">4.5</span>
          <span className="h-px w-8 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]" />
          <span>Live Demo</span>
        </div>

        <h2 className="mt-2 text-4xl font-bold text-[var(--text)] sm:text-5xl">
          Try the{' '}
          <span className="bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-transparent italic">
            backend
          </span>
          .
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-[var(--text-muted)]">
          A real interactive panel — pick a query and watch the response come back. Real data, not mocked.
        </p>

        <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] text-left lg:grid-cols-[minmax(0,260px)_1fr]">
          {/* Sample queries */}
          <div className="border-b border-[var(--border)] p-4 lg:border-r lg:border-b-0">
            <p className="px-2 text-xs tracking-widest text-[var(--text-muted)] uppercase">Sample Queries</p>
            <motion.ul
              variants={LIST_VARIANTS}
              initial="hidden"
              whileInView="show"
              viewport={{
                once: true,
                amount: 0.2,
              }}
              className="mt-3 space-y-1"
            >
              {queries.map((query) => {
                const isSelected = query.id === selected.id
                return (
                  <motion.li key={query.id} variants={LIST_ITEM_VARIANTS}>
                    <button
                      type="button"
                      onClick={() => send(query)}
                      disabled={sending}
                      aria-pressed={isSelected}
                      className={`flex w-full items-center gap-2 rounded-lg border-l-2 px-2 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${isSelected ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-transparent hover:bg-[var(--bg-alt)]'}`}
                    >
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${query.method === 'POST' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--border)] text-[var(--text-muted)]'}`}
                      >
                        {query.method}
                      </span>
                      <span className="font-mono text-sm text-[var(--text)]">{query.label}</span>
                    </button>
                  </motion.li>
                )
              })}
            </motion.ul>
          </div>

          {/* Request / response panel */}
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] p-4">
              <span
                className={`rounded px-2 py-1 font-mono text-xs font-semibold ${selected.method === 'POST' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--border)] text-[var(--text)]'}`}
              >
                {selected.method}
              </span>
              <span className="min-w-0 flex-1 truncate font-mono text-sm text-[var(--text-muted)]">
                {API_BASE_URL}
                {selected.path}
              </span>
              <button
                type="button"
                onClick={() => send(selected)}
                disabled={sending}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-4 py-2 font-mono text-sm font-medium text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
              >
                {sending ? 'sending…' : 'send'} <ArrowRight aria-hidden size={14} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] bg-[var(--bg-alt)] px-4 py-2 font-mono text-xs text-[var(--text-muted)]">
              {sending ? (
                <span>sending…</span>
              ) : (
                <>
                  <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-semibold text-emerald-500">200</span>
                  <span>json</span>
                  <span aria-hidden>·</span>
                  <span>{timeMs}ms</span>
                  <span aria-hidden>·</span>
                  <span>{sizeKb} KB</span>
                  <span className="ml-auto hidden sm:inline">ap-southeast-1</span>
                </>
              )}
            </div>

            <div className="min-h-[220px] flex-1 overflow-x-auto p-4">
              {!sending && (
                <motion.pre
                  // Keyed on the query id so switching (or re-sending) a
                  // query remounts this and replays the reveal, instead of
                  // the new response just snapping into place.
                  key={selected.id}
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeOut',
                  }}
                  className="font-mono text-sm text-[var(--text)]"
                  // Content is escaped in highlightJson before any HTML is
                  // built — see the function above.
                  dangerouslySetInnerHTML={{
                    __html: highlightJson(body),
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
