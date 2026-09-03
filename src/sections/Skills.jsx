import { useEffect, useState } from 'react'
import { useCursorSpotlight } from '../hooks/useCursorSpotlight'
const CATEGORY_ORDER = ['frontend', 'backend', 'infrastructure', 'language', 'ai']
const CATEGORY_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  infrastructure: 'Infrastructure',
  language: 'Language',
  ai: 'A.I',
}

// Not every backend proficiency value maps to a distinct width yet (the
// real data is currently all "proficient"), but this is ready to reflect
// more granular levels as soon as the data has them.
const PROFICIENCY_WIDTH = {
  expert: 100,
  advanced: 85,
  proficient: 75,
  intermediate: 60,
  beginner: 35,
}
function getProficiencyWidth(level) {
  return PROFICIENCY_WIDTH[level.toLowerCase()] ?? 70
}

// No icon assets/URLs from the backend yet (icon_slug is always null in
// practice) — a short initials badge is a reasonable stand-in until there
// are real per-skill icons to render.
function getIconLabel(name) {
  const cleaned = name.replace(/[^a-zA-Z0-9]/g, '')
  return cleaned.slice(0, 2).toUpperCase() || '?'
}
export function Skills({ skills }) {
  const { spotlightRef, handleMouseMove } = useCursorSpotlight()
  const presentCategories = CATEGORY_ORDER.filter((category) => skills.some((skill) => skill.category === category))
  const [activeCategory, setActiveCategory] = useState(null)

  // `skills` starts as [] while the query is still loading, so the real
  // categories aren't known at mount — auto-select the first one once they
  // arrive, without clobbering a category the user has since clicked.
  useEffect(() => {
    if (activeCategory === null && presentCategories.length > 0) {
      setActiveCategory(presentCategories[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- presentCategories
    // is a fresh array each render by design; its joined value is the
    // actual stable dependency.
  }, [activeCategory, presentCategories.join(',')])
  const visibleSkills = activeCategory ? skills.filter((skill) => skill.category === activeCategory) : []
  return (
    <section
      id="skills"
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
          <span className="font-mono text-[var(--accent)]">02</span>
          <span className="h-px w-8 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]" />
          <span>Skills</span>
        </div>

        <h2 className="mt-2 text-4xl font-bold text-[var(--text)] sm:text-5xl">Skills</h2>
        <p className="mt-2 text-[var(--text-muted)]">Technologies and tools I work with</p>

        {presentCategories.length > 1 && (
          <div className="mt-8 inline-flex flex-wrap justify-center gap-1 rounded-full border border-[var(--border)] p-1">
            {presentCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-widest uppercase transition-colors ${activeCategory === category ? 'bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
              >
                {CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
          {visibleSkills.map((skill, index) => (
            <div
              key={skill.id}
              className="group relative rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 transition-all duration-300 ease-out hover:scale-[1.03] hover:border-[var(--accent)]"
            >
              {/* Inset a couple steps from the true corner so the brackets
                  read as inside the card, not sitting on its edge. */}
              <span
                aria-hidden
                className="absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100"
              />
              <span
                aria-hidden
                className="absolute right-2 bottom-2 h-4 w-4 border-r-2 border-b-2 border-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100"
              />

              <div className="flex items-start justify-between">
                <div
                  aria-hidden
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--border)] text-xs font-bold text-[var(--text)]"
                >
                  {getIconLabel(skill.name)}
                </div>
                <span className="font-mono text-xs text-[var(--text-muted)]">{String(index + 1).padStart(2, '0')}</span>
              </div>

              <p className="mt-3 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text font-semibold text-[var(--text)] transition-[color] group-hover:text-transparent">
                {skill.name}
              </p>
              <p className="text-xs tracking-widest text-[var(--text-muted)] uppercase">{skill.proficiency}</p>

              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--border)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)]"
                  style={{
                    width: `${getProficiencyWidth(skill.proficiency)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {visibleSkills.length === 0 && <p className="mt-10 text-[var(--text-muted)]">No skills listed yet.</p>}
      </div>
    </section>
  )
}
