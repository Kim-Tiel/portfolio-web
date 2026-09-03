import { useEffect, useState } from 'react'

/**
 * Tracks whether the page has been scrolled past a small threshold — lets
 * the nav go from an opaque floating pill (at the top) to fully transparent
 * chrome once the page has scrolled.
 */
export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(() => window.scrollY > threshold)
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > threshold)
    }
    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])
  return scrolled
}
