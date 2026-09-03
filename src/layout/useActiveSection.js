import { useEffect, useState } from 'react'

/**
 * Tracks which of the given section ids is currently "active" — the one
 * crossing a thin horizontal band near vertical-center of the viewport —
 * so the nav can highlight the section the user is actually looking at
 * while scrolling.
 */
export function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')
  useEffect(() => {
    if (sectionIds.length === 0) return
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      },
    )

    // Some sections (e.g. ones gated behind an async load, like the profile
    // query) don't exist in the DOM yet the moment the nav mounts — Nav
    // itself renders immediately, before that data arrives. Observing only
    // what's present *right now* would permanently miss those, since this
    // effect has nothing in its dependencies that changes when they finally
    // mount. So: observe whatever ids already exist, then watch the DOM for
    // the rest to show up and start observing them too, only stopping that
    // watch once every id has been found.
    const observedIds = new Set()
    function observeAvailableSections() {
      for (const id of sectionIds) {
        if (observedIds.has(id)) continue
        const element = document.getElementById(id)
        if (element) {
          intersectionObserver.observe(element)
          observedIds.add(id)
        }
      }
    }
    observeAvailableSections()
    let mutationObserver = null
    if (observedIds.size < sectionIds.length) {
      mutationObserver = new MutationObserver(() => {
        observeAvailableSections()
        if (observedIds.size === sectionIds.length) {
          mutationObserver?.disconnect()
        }
      })
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      })
    }
    return () => {
      intersectionObserver.disconnect()
      mutationObserver?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sectionIds is a
    // fresh array each render by design (caller passes a literal); re-running
    // per-id-value change would defeat memoization for no benefit here.
  }, [sectionIds.join(',')])
  return activeId
}
