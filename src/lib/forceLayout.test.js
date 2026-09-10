import { describe, expect, it } from 'vitest'
import { seedPositions, step } from './forceLayout'

const W = 900
const H = 520

describe('forceLayout', () => {
  it('seeds nodes on a ring inside the box', () => {
    const seeded = seedPositions([{ id: 'a' }, { id: 'b' }, { id: 'c' }], W, H)
    expect(seeded).toHaveLength(3)
    for (const n of seeded) {
      expect(n.x).toBeGreaterThan(0)
      expect(n.x).toBeLessThan(W)
      expect(n.y).toBeGreaterThan(0)
      expect(n.y).toBeLessThan(H)
      expect(n.vx).toBe(0)
    }
  })

  it('pushes two coincident nodes apart', () => {
    const nodes = [
      { id: 'a', x: 450, y: 260, vx: 0, vy: 0 },
      { id: 'b', x: 450, y: 260, vx: 0, vy: 0 },
    ]
    for (let i = 0; i < 40; i++) step(nodes, [], { width: W, height: H })
    const dist = Math.hypot(nodes[0].x - nodes[1].x, nodes[0].y - nodes[1].y)
    expect(dist).toBeGreaterThan(20)
  })

  it('keeps nodes inside the box and settles as alpha cools', () => {
    const nodes = seedPositions(
      Array.from({ length: 8 }, (_, i) => ({ id: String(i) })),
      W,
      H,
    )
    const edges = nodes.slice(1).map((n, i) => ({ source: nodes[i].id, target: n.id }))
    let alpha = 1
    for (let i = 0; i < 300; i++) {
      step(nodes, edges, { width: W, height: H, alpha })
      alpha *= 0.985
    }
    for (const n of nodes) {
      expect(n.x).toBeGreaterThanOrEqual(0)
      expect(n.x).toBeLessThanOrEqual(W)
      expect(Math.hypot(n.vx, n.vy)).toBeLessThan(2)
    }
  })

  it('links pull connected nodes toward linkDistance', () => {
    const nodes = [
      { id: 'a', x: 100, y: 260, vx: 0, vy: 0 },
      { id: 'b', x: 800, y: 260, vx: 0, vy: 0 },
    ]
    const edges = [{ source: 'a', target: 'b' }]
    for (let i = 0; i < 200; i++) step(nodes, edges, { width: W, height: H, charge: 0, centerStrength: 0 })
    const dist = Math.hypot(nodes[0].x - nodes[1].x, nodes[0].y - nodes[1].y)
    expect(dist).toBeLessThan(700)
  })
})
