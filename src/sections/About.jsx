import { useCursorSpotlight } from '../hooks/useCursorSpotlight'
function getInitials(name) {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}
export function About({ profile, education }) {
  const { spotlightRef, handleMouseMove } = useCursorSpotlight()
  return (
    <section
      id="about"
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[calc(100vh-90px)] flex-col justify-center overflow-hidden px-4 py-24"
    >
      {/* Flat background — no static ambient blobs here (unlike the hero),
          just the cursor-following glow below. Its default position sits
          over the text column, not the photo card — the card's opaque
          background would otherwise hide most of the glow until the
          pointer moved away from it. */}
      <div
        ref={spotlightRef}
        aria-hidden
        data-testid="cursor-spotlight"
        className="pointer-events-none absolute top-[30%] left-[65%] -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-from)]/25 opacity-0 blur-[110px] transition-[left,top,opacity] duration-500 ease-out"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-center gap-3 text-center text-sm tracking-widest text-[var(--text-muted)] uppercase">
        <span className="font-mono text-[var(--accent)]">01</span>
        <span className="h-px w-8 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]" />
        <span>About</span>
      </div>

      <div className="relative z-10 mx-auto mt-10 grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-start">
        <div className="relative mx-auto w-full max-w-md">
          <div
            aria-hidden
            className="absolute -right-3 -bottom-3 h-full w-full rounded-2xl border border-[var(--accent)]/40"
          />

          <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)]">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                loading="lazy"
                className="aspect-[4/5] w-full scale-100 object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            ) : (
              <div
                aria-hidden
                data-testid="avatar-initials"
                className="flex aspect-[4/5] w-full scale-100 items-center justify-center text-4xl font-bold text-[var(--text-muted)] transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              >
                {getInitials(profile.name)}
              </div>
            )}

            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
              {profile.available_for.length > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[10px] tracking-widest text-white uppercase backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Available
                </span>
              )}
              <span className="ml-auto rounded-full bg-black/40 px-3 py-1 text-[10px] tracking-widest text-white uppercase backdrop-blur">
                {getInitials(profile.name)} · 01
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 text-left">
              <p className="text-[10px] tracking-widest text-white/70 uppercase">{profile.title}</p>
              <p className="mt-1 text-2xl font-bold text-white">{profile.name}</p>
              <span aria-hidden className="mt-2 block h-px w-10 bg-[var(--accent)]" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-[var(--text)] sm:text-5xl">
            About{' '}
            <span className="bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-transparent italic">
              Me
            </span>
          </h2>

          <p className="mt-2 text-xl font-semibold text-[var(--text)]">{profile.title}</p>

          <div className="mt-8 grid grid-cols-1 divide-y divide-[var(--glass-border)] rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-lg shadow-black/10 [backdrop-filter:blur(24px)_saturate(180%)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {profile.years_career_experience !== null && (
              <div className="p-5 transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <p className="text-xs tracking-widest text-[var(--text-muted)] uppercase">01 · Experience</p>
                <p className="mt-1 font-semibold text-[var(--text)]">
                  {profile.years_career_experience}+ Years Experience
                </p>
              </div>
            )}
            {profile.available_for.length > 0 && (
              <div className="p-5 transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <p className="text-xs tracking-widest text-[var(--text-muted)] uppercase">02 · Status</p>
                <p className="mt-1 font-semibold text-[var(--text)]">
                  Available for {profile.available_for.join(' & ')}
                </p>
              </div>
            )}
            {profile.location && (
              <div className="p-5 transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <p className="text-xs tracking-widest text-[var(--text-muted)] uppercase">03 · Based In</p>
                <p className="mt-1 font-semibold text-[var(--text)]">{profile.location}</p>
              </div>
            )}
          </div>

          {profile.bio && (
            <p className="mt-8 border-l-2 border-[var(--accent)] pl-4 text-[var(--text-muted)]">{profile.bio}</p>
          )}

          {education.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xs tracking-widest text-[var(--text-muted)] uppercase">Education</h3>
              <div className="mt-4 space-y-6">
                {education.map((entry) => (
                  <div key={entry.id}>
                    <h4 className="text-lg font-semibold text-[var(--text)]">{entry.institution}</h4>
                    <p className="text-[var(--text-muted)]">
                      {entry.degree}
                      {entry.field ? ` · ${entry.field}` : ''}
                    </p>
                    {entry.milestones.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
                        {entry.milestones.map((milestone) => (
                          <li key={`${milestone.occurred_on}-${milestone.description}`}>{milestone.description}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
