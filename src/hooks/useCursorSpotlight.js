import { useRef } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
/**
 * Ref + mousemove handler for a decorative glow that eases toward the
 * pointer within its container (see the `.transition-[left,top,opacity]`
 * class on the rendered spotlight `div`). Imperative — a direct style
 * write on every pointer move — instead of React state, which would
 * re-render the whole section dozens of times a second.
 *
 * Deliberately does NOT hide/reset on mouseleave: it stays wherever it
 * last was, so moving from one section into the next reads as one
 * continuous glow rather than the effect vanishing at every boundary.
 */
export function useCursorSpotlight() {
  const reducedMotion = usePrefersReducedMotion()
  const spotlightRef = useRef(null)
  function handleMouseMove(event) {
    if (reducedMotion) return
    const node = spotlightRef.current
    if (!node) return
    const rect = event.currentTarget.getBoundingClientRect()
    node.style.left = `${event.clientX - rect.left}px`
    node.style.top = `${event.clientY - rect.top}px`
    node.style.opacity = '1'
  }
  return {
    spotlightRef,
    handleMouseMove,
  }
}
