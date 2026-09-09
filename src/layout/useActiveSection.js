import { useEffect, useState } from 'react'

// How far down the viewport the "active line" sits — a section becomes
// active once its top has scrolled past this point.
const ACTIVE_LINE_RATIO = 0.4

/**
 * Tracks which of the given section ids is currently "active" — the last
 * one (in document order) whose top has scrolled past a line near the top
 * of the viewport — so the nav can highlight the section the user is
 * actually looking at while scrolling.
 *
 * This recomputes from live element geometry on every scroll/resize rather
 * than watching a thin intersection band: sections here vary a lot in
 * height (a tall project grid next to a short experience panel), and a
 * band can get "stuck" on a section that's taller than the band's travel
 * range, or skip past a short one between two scroll events entirely.
 * Comparing every section's current position always picks the right one
 * regardless of how tall any of them are.
 */
export function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')
  useEffect(() => {
    if (sectionIds.length === 0) return
    let frame = null
    function computeActiveId() {
      const activeLine = window.innerHeight * ACTIVE_LINE_RATIO
      let current = sectionIds[0] ?? ''
      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= activeLine) {
          current = id
        }
      }
      return current
    }
    function handleUpdate() {
      frame = null
      setActiveId(computeActiveId())
    }
    function scheduleUpdate() {
      if (frame !== null) return
      frame = requestAnimationFrame(handleUpdate)
    }
    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, {
      passive: true,
    })
    window.addEventListener('resize', scheduleUpdate)

    // Some sections (e.g. ones gated behind an async load, like the profile
    // query) don't exist in the DOM yet the moment the nav mounts — Nav
    // itself renders immediately, before that data arrives. Re-checking
    // whenever the DOM changes means their nav link can still highlight
    // once they mount, without requiring the user to scroll again first.
    const mutationObserver = new MutationObserver(scheduleUpdate)
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      mutationObserver.disconnect()
      if (frame !== null) cancelAnimationFrame(frame)
    }
    // sectionIds is a fresh array each render by design (caller passes a
    // literal); re-running per-id-value change would defeat memoization for
    // no benefit here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(',')])
  return activeId
}
