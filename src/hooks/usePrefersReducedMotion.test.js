import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
function mockMatchMedia(initialMatches) {
  let changeHandler = null
  const mql = {
    matches: initialMatches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: (_type, handler) => {
      changeHandler = handler
    },
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }
  return {
    mql,
    fireChange(matches) {
      changeHandler?.({
        matches,
      })
    },
  }
}
describe('usePrefersReducedMotion', () => {
  it('reflects the current matchMedia value on mount', () => {
    const { mql } = mockMatchMedia(true)
    const original = window.matchMedia
    window.matchMedia = () => mql
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(true)
    window.matchMedia = original
  })
  it('updates live when the preference changes', () => {
    const { mql, fireChange } = mockMatchMedia(false)
    const original = window.matchMedia
    window.matchMedia = () => mql
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)
    act(() => fireChange(true))
    expect(result.current).toBe(true)
    window.matchMedia = original
  })
})
