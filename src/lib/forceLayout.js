// Tiny hand-rolled force-directed layout — no dependency. Sized for the
// Memory Log graph (<= 50 nodes), so the O(n^2) repulsion is fine.

const MARGIN = 40

export function seedPositions(nodes, width, height, opts = {}) {
  const cx = opts.centerX ?? width / 2
  const cy = opts.centerY ?? height / 2
  const radius = Math.min(width, height) * 0.32
  return nodes.map((node, i) => {
    const angle = (i / Math.max(nodes.length, 1)) * Math.PI * 2
    return {
      ...node,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      vx: 0,
      vy: 0,
    }
  })
}

export function step(nodes, edges, opts = {}) {
  const {
    width = 900,
    height = 520,
    charge = -2600,
    linkDistance = 140,
    linkStrength = 0.06,
    centerStrength = 0.02,
    damping = 0.82,
    maxVelocity = 24,
    // Global cooling factor. The caller decays it toward 0 so the system
    // is guaranteed to freeze instead of oscillating forever.
    alpha = 1,
    // Where the centering pull aims. Defaults to the middle of the box;
    // callers bias this (e.g. right) to keep the cluster clear of an overlay.
    centerX,
    centerY,
  } = opts

  const byId = new Map(nodes.map((n) => [n.id, n]))
  const cx = centerX ?? width / 2
  const cy = centerY ?? height / 2

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i]
      const b = nodes[j]
      let dx = a.x - b.x
      let dy = a.y - b.y
      if (dx === 0 && dy === 0) {
        // Coincident: nudge along a deterministic diagonal so repulsion
        // has a direction to work with.
        dx = 1e-3
        dy = 1e-3
      }
      const distSq = dx * dx + dy * dy
      const dist = Math.sqrt(distSq)
      const force = (charge / distSq) * alpha
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      a.vx += fx
      a.vy += fy
      b.vx -= fx
      b.vy -= fy
    }
  }

  for (const edge of edges) {
    const a = byId.get(edge.source)
    const b = byId.get(edge.target)
    if (!a || !b) continue
    const dx = b.x - a.x
    const dy = b.y - a.y
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
    const delta = (dist - linkDistance) * linkStrength * alpha
    const fx = (dx / dist) * delta
    const fy = (dy / dist) * delta
    a.vx += fx
    a.vy += fy
    b.vx -= fx
    b.vy -= fy
  }

  for (const n of nodes) {
    n.vx += (cx - n.x) * centerStrength * alpha
    n.vy += (cy - n.y) * centerStrength * alpha
  }

  for (const n of nodes) {
    n.vx *= damping
    n.vy *= damping
    const speed = Math.hypot(n.vx, n.vy)
    if (speed > maxVelocity) {
      n.vx = (n.vx / speed) * maxVelocity
      n.vy = (n.vy / speed) * maxVelocity
    }

    let nx = n.x + n.vx
    if (nx < MARGIN) {
      nx = MARGIN
      n.vx = 0
    } else if (nx > width - MARGIN) {
      nx = width - MARGIN
      n.vx = 0
    }
    n.x = nx

    let ny = n.y + n.vy
    if (ny < MARGIN) {
      ny = MARGIN
      n.vy = 0
    } else if (ny > height - MARGIN) {
      ny = height - MARGIN
      n.vy = 0
    }
    n.y = ny
  }

  return nodes
}
