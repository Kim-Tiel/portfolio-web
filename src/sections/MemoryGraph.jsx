import { useEffect, useMemo, useRef, useState } from 'react'
import { seedPositions, step } from '../lib/forceLayout'

const VIEW_W = 900
const VIEW_H = 520
const ALPHA_MIN = 0.02
const ALPHA_DECAY = 0.985
// How many nearby notes light up a connection when a node is selected.
const NEAR_LINKS = 3
// Bias the cluster to the right so it clears the note form overlaid bottom-left.
const CENTER_X = VIEW_W * 0.66
const LAYOUT_OPTS = { centerX: CENTER_X }

function initials(name) {
  const words = (name || '').trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

function ScreenReaderList({ entries }) {
  return (
    <ul aria-label="All visitor notes" className="sr-only">
      {entries.map((entry) => (
        <li key={entry.id}>
          {entry.display_name} on {formatDate(entry.created_at)}: {entry.message}
        </li>
      ))}
    </ul>
  )
}

function CardList({ entries }) {
  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li key={entry.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-medium text-[var(--accent)]">{entry.display_name}</span>
            <span className="flex-none font-mono text-xs text-[var(--text-muted)]">{formatDate(entry.created_at)}</span>
          </div>
          <p className="mt-2 break-words whitespace-pre-wrap text-[var(--text)]">{entry.message}</p>
        </li>
      ))}
    </ul>
  )
}

export function MemoryGraph({ entries }) {
  const reduced = prefersReducedMotion()

  const ordered = useMemo(() => [...entries].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)), [entries])
  const edges = useMemo(
    () => ordered.slice(1).map((entry, i) => ({ source: ordered[i].id, target: entry.id })),
    [ordered],
  )

  const [nodes, setNodes] = useState(() =>
    seedPositions(
      ordered.map((e) => ({ id: e.id })),
      VIEW_W,
      VIEW_H,
      LAYOUT_OPTS,
    ),
  )
  const [selectedId, setSelectedId] = useState(null)
  const [view, setView] = useState({ x: 0, y: 0, k: 1 })
  const dragRef = useRef(null)

  useEffect(() => {
    if (reduced) return undefined

    const live = seedPositions(
      ordered.map((e) => ({ id: e.id })),
      VIEW_W,
      VIEW_H,
      LAYOUT_OPTS,
    )
    let alpha = 1
    let raf
    const tick = () => {
      step(live, edges, {
        width: VIEW_W,
        height: VIEW_H,
        alpha,
        charge: -2600,
        linkDistance: 130,
        centerX: CENTER_X,
      })
      alpha *= ALPHA_DECAY
      setNodes(live.map((n) => ({ ...n })))
      if (alpha > ALPHA_MIN) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [ordered, edges, reduced])

  if (reduced) {
    return (
      <>
        <CardList entries={ordered} />
        <ScreenReaderList entries={entries} />
      </>
    )
  }

  const byId = new Map(nodes.map((n) => [n.id, n]))
  const selected = ordered.find((e) => e.id === selectedId) || null

  function onPointerDown(event) {
    if (event.target.closest('[data-node]')) return
    dragRef.current = { px: event.clientX, py: event.clientY, ox: view.x, oy: view.y }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }
  function onPointerMove(event) {
    if (!dragRef.current) return
    setView((v) => ({
      ...v,
      x: dragRef.current.ox + (event.clientX - dragRef.current.px),
      y: dragRef.current.oy + (event.clientY - dragRef.current.py),
    }))
  }
  function onPointerUp(event) {
    dragRef.current = null
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  return (
    <div className="absolute inset-0">
      <svg
        role="img"
        aria-label="Visitor note graph. Interactive; the same notes are listed for screen readers below."
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="block h-full w-full touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <defs>
          <filter id="ml-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <style>{`
            .ml-edge { stroke-dasharray: 1; animation: ml-edge-draw 320ms ease-out forwards; }
            @keyframes ml-edge-draw {
              from { stroke-dashoffset: 1; opacity: 0; }
              to { stroke-dashoffset: 0; opacity: 1; }
            }
            @media (prefers-reduced-motion: reduce) {
              .ml-edge { animation: none; stroke-dasharray: none; }
            }
          `}</style>
        </defs>

        <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
          {selectedId &&
            (() => {
              const origin = byId.get(selectedId)
              if (!origin) return null
              return nodes
                .filter((n) => n.id !== selectedId)
                .map((n) => ({ n, dist: Math.hypot(n.x - origin.x, n.y - origin.y) }))
                .sort((a, b) => a.dist - b.dist)
                .slice(0, NEAR_LINKS)
                .map(({ n }) => (
                  <line
                    key={n.id}
                    x1={origin.x}
                    y1={origin.y}
                    x2={n.x}
                    y2={n.y}
                    stroke="var(--accent)"
                    strokeWidth={1.5}
                    strokeOpacity={0.55}
                    pathLength="1"
                    className="ml-edge"
                  />
                ))
            })()}

          {ordered.map((entry) => {
            const node = byId.get(entry.id)
            if (!node) return null
            const active = entry.id === selectedId
            return (
              <g
                key={entry.id}
                data-node
                role="button"
                tabIndex={0}
                aria-label={`Note from ${entry.display_name}`}
                transform={`translate(${node.x} ${node.y})`}
                className="cursor-pointer focus:outline-none"
                onClick={() => setSelectedId(entry.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedId(entry.id)
                  }
                }}
              >
                <circle
                  r={active ? 26 : 22}
                  fill="var(--bg)"
                  stroke="var(--accent)"
                  strokeWidth={active ? 2 : 1.25}
                  strokeOpacity={active ? 1 : 0.45}
                  filter="url(#ml-glow)"
                />
                <text
                  textAnchor="middle"
                  dy="0.35em"
                  className="font-mono text-[11px] uppercase"
                  fill={active ? 'var(--accent)' : 'var(--text-muted)'}
                >
                  {initials(entry.display_name)}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      <button
        type="button"
        onClick={() => {
          setView({ x: 0, y: 0, k: 1 })
          setSelectedId(null)
        }}
        className="absolute top-3 right-3 rounded-full border border-[var(--border)] bg-[var(--bg)]/80 px-3 py-1 text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
      >
        Reset view
      </button>

      {selected && (
        <div className="absolute top-3 left-3 z-10 max-w-sm rounded-xl border border-[var(--accent)]/40 bg-[var(--bg)]/95 p-4 [backdrop-filter:blur(8px)]">
          <div className="flex items-start justify-between gap-4">
            <span className="font-mono text-sm text-[var(--accent)]">{selected.display_name}</span>
            <span className="flex items-center gap-3">
              <span className="font-mono text-xs text-[var(--text-muted)]">{formatDate(selected.created_at)}</span>
              <button
                type="button"
                aria-label="Close note"
                onClick={() => setSelectedId(null)}
                className="text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
              >
                &times;
              </button>
            </span>
          </div>
          <p className="mt-2 break-words whitespace-pre-wrap text-sm text-[var(--text)]">{selected.message}</p>
        </div>
      )}

      <ScreenReaderList entries={entries} />
    </div>
  )
}
