import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCursorSpotlight } from '../hooks/useCursorSpotlight'
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL
function formatMonthYear(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}
function formatDateRange(startDate, endDate) {
  const start = formatMonthYear(startDate)
  const end = endDate ? formatMonthYear(endDate) : 'Present'
  return `${start} — ${end}`
}

// Deterministic (not cryptographic) hash — just enough so an entry without a
// real `commit_hash` from the backend still gets a stable, git-looking one
// instead of the section falling apart or showing a placeholder.
function hashFrom(seed) {
  let hash = 0
  for (let index = 0; index < seed.length; index++) {
    hash = (hash << 5) - hash + seed.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}
function shortHash(experience) {
  const base = experience.commit_hash ?? hashFrom(experience.id)
  return base.slice(0, 7)
}
function fullHash(experience) {
  const base = experience.commit_hash ?? hashFrom(experience.id)
  return (base + hashFrom(base)).slice(0, 16)
}

// "b/wonderbeauties.log" — the diff header's filename, derived from the
// company name the same way a real log file would be named.
function logFileName(company) {
  return company.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'
}
export function Experience({ experiences, profile }) {
  const { spotlightRef, handleMouseMove } = useCursorSpotlight()
  const sorted = [...experiences].sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
  const [selectedId, setSelectedId] = useState(sorted[0]?.id ?? null)
  const selected = sorted.find((experience) => experience.id === selectedId) ?? sorted[0] ?? null
  return (
    <section
      id="experience"
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-[var(--bg-alt)] px-4 py-24"
    >
      <div
        ref={spotlightRef}
        aria-hidden
        data-testid="cursor-spotlight"
        className="pointer-events-none absolute top-1/2 left-1/2 z-20 mix-blend-screen h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-from)]/20 opacity-0 blur-[110px] transition-[left,top,opacity] duration-500 ease-out"
      />

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <div className="flex items-center justify-center gap-3 text-sm tracking-widest text-[var(--text-muted)] uppercase">
          <span className="font-mono text-[var(--accent)]">04</span>
          <span className="h-px w-8 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]" />
          <span>Experience</span>
        </div>

        <h2 className="mt-2 text-4xl font-bold text-[var(--text)] sm:text-5xl">Career commit history</h2>
        <p className="mt-2 font-mono text-sm text-[var(--text-muted)]">git log --oneline --graph</p>

        {sorted.length === 0 && <p className="mt-10 text-[var(--text-muted)]">No experience listed yet.</p>}

        {sorted.length > 0 && (
          <div className="mt-10 grid gap-0 overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-left shadow-lg shadow-black/10 [backdrop-filter:blur(24px)_saturate(180%)] lg:grid-cols-2">
            {/* Commit list */}
            <ol className="border-b border-[var(--border)] p-6 lg:border-r lg:border-b-0">
              {sorted.map((experience, index) => {
                const isSelected = experience.id === selected?.id
                const isHead = index === 0
                const isLast = index === sorted.length - 1
                return (
                  <li key={experience.id} className="flex gap-4">
                    {/* Rail: connector segments above/below the marker, as
                        separate elements rather than one line the marker
                        sits on top of — so the line actually breaks at
                        each commit instead of just being hidden behind
                        it. The head commit has no segment above it (it's
                        first), which also naturally pins its circle to
                        the top of the row instead of centering it like
                        every other commit does. */}
                    <div className="flex flex-col items-center">
                      <span className={isHead ? 'h-[18px] w-px' : 'w-px flex-1 bg-[var(--accent)]/40'} />
                      <span
                        aria-hidden
                        className={`h-3 w-3 shrink-0 rounded-full border-2 border-[var(--accent)] ${isSelected ? 'bg-[var(--accent)]' : 'bg-[var(--bg)]'}`}
                      />
                      <span className={`w-px flex-1 ${isLast ? '' : 'bg-[var(--accent)]/40'}`} />
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedId(experience.id)}
                      aria-pressed={isSelected}
                      className={`min-w-0 flex-1 scale-100 rounded-lg px-3 py-3 text-left transition-all duration-150 ease-out active:scale-[0.97] ${isSelected ? 'bg-[var(--accent)]/10' : 'hover:bg-[var(--bg-alt)]'}`}
                    >
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-[var(--accent)]">{shortHash(experience)}</span>
                        {isHead && (
                          <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-2 py-0.5 font-mono text-[10px] text-[var(--accent)]">
                            HEAD → main
                          </span>
                        )}
                      </span>
                      <span className="mt-1 block font-semibold text-[var(--text)]">{experience.role}</span>
                      <span className="block text-sm text-[var(--text-muted)]">
                        {experience.company} · {formatDateRange(experience.start_date, experience.end_date)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>

            {/* Selected commit detail — keyed on the commit id so switching
                selection remounts this, replaying the fade-in and giving
                clicking a commit a visible effect instead of the content
                just snapping to the new values. */}
            {selected && (
              <motion.div
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
                  duration: 0.25,
                  ease: 'easeOut',
                }}
                className="p-6 sm:p-8"
              >
                <div className="font-mono text-xs text-[var(--text-muted)]">
                  <p>
                    commit <span className="text-[var(--accent)]">{fullHash(selected)}</span>
                  </p>
                  {profile && (
                    <p className="mt-1">
                      Author: {profile.name} &lt;{CONTACT_EMAIL}&gt;
                    </p>
                  )}
                  <p className="mt-1">Date: {formatDateRange(selected.start_date, selected.end_date)}</p>
                </div>

                <div className="mt-5 border-t border-[var(--border)] pt-5">
                  <h3 className="text-xl font-bold text-[var(--text)]">{selected.role}</h3>
                  <p className="mt-1 text-[var(--text-muted)]">
                    {selected.company}
                    {selected.location ? ` · ${selected.location}` : ''}
                    {selected.is_remote ? ' · Remote' : ''}
                  </p>
                </div>

                {selected.highlights.length > 0 && (
                  <div className="mt-5 font-mono text-xs">
                    <p className="text-[var(--text-muted)]">--- /dev/null</p>
                    <p className="text-[var(--text-muted)]">+++ b/{logFileName(selected.company)}.log</p>
                    <ul className="mt-2 space-y-1.5">
                      {selected.highlights.map((highlight) => (
                        <li key={highlight} className="text-[var(--text)]">
                          <span className="text-emerald-500">+</span> {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selected.skills.length > 0 && (
                  <div className="mt-6">
                    <p className="font-mono text-xs tracking-widest text-[var(--text-muted)] uppercase">Stack</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selected.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="rounded-full border border-[var(--accent)]/25 bg-[var(--accent)]/5 px-3 py-1 text-xs text-[var(--text)]"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
