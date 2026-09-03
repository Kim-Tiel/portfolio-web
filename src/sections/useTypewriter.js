import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
/**
 * Cycles through `lines` with a type-out / pause / delete / next-line loop,
 * matching the reference site's rotating-role effect. Respects
 * prefers-reduced-motion by just showing the first line statically.
 */
export function useTypewriter(lines, options = {}) {
  const { typingSpeedMs = 45, deletingSpeedMs = 25, pauseMs = 1500 } = options
  const reducedMotion = usePrefersReducedMotion()
  const [lineIndex, setLineIndex] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    if (reducedMotion || lines.length === 0) return
    const currentLine = lines[lineIndex % lines.length]
    const atEndOfLine = !deleting && charCount === currentLine.length
    const timeoutMs = atEndOfLine ? pauseMs : deleting ? deletingSpeedMs : typingSpeedMs
    const timeout = setTimeout(() => {
      if (atEndOfLine) {
        setDeleting(true)
        return
      }
      if (deleting && charCount === 0) {
        setDeleting(false)
        setLineIndex((index) => (index + 1) % lines.length)
        return
      }
      setCharCount((count) => count + (deleting ? -1 : 1))
    }, timeoutMs)
    return () => clearTimeout(timeout)
  }, [charCount, deleting, lineIndex, lines, reducedMotion, typingSpeedMs, deletingSpeedMs, pauseMs])
  if (lines.length === 0) return ''
  if (reducedMotion) return lines[0]
  return lines[lineIndex % lines.length].slice(0, charCount)
}
