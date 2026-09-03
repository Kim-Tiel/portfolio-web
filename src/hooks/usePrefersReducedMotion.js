import { useEffect, useState } from 'react'

/** Tracks the user's prefers-reduced-motion OS/browser setting live. */
export function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(query.matches)
    function handleChange(event) {
      setReducedMotion(event.matches)
    }
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])
  return reducedMotion
}
