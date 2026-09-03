import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTypewriter } from './useTypewriter'
describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  it('types out the first line one character at a time', () => {
    const { result } = renderHook(() =>
      useTypewriter(['Hi'], {
        typingSpeedMs: 10,
      }),
    )
    expect(result.current).toBe('')
    act(() => vi.advanceTimersByTime(10))
    expect(result.current).toBe('H')
    act(() => vi.advanceTimersByTime(10))
    expect(result.current).toBe('Hi')
  })
  it('pauses, deletes, then moves to the next line and loops', () => {
    const { result } = renderHook(() =>
      useTypewriter(['Ab', 'Cd'], {
        typingSpeedMs: 10,
        deletingSpeedMs: 10,
        pauseMs: 100,
      }),
    )

    // Type "Ab" fully.
    act(() => vi.advanceTimersByTime(10))
    act(() => vi.advanceTimersByTime(10))
    expect(result.current).toBe('Ab')

    // Still paused, hasn't started deleting yet.
    act(() => vi.advanceTimersByTime(50))
    expect(result.current).toBe('Ab')

    // Pause elapses, deleting begins.
    act(() => vi.advanceTimersByTime(50))
    act(() => vi.advanceTimersByTime(10))
    expect(result.current).toBe('A')
    act(() => vi.advanceTimersByTime(10))
    expect(result.current).toBe('')

    // One tick to recognize "done deleting, switch line", one more to type
    // the new line's first character.
    act(() => vi.advanceTimersByTime(10))
    act(() => vi.advanceTimersByTime(10))
    expect(result.current).toBe('C')
    act(() => vi.advanceTimersByTime(10))
    expect(result.current).toBe('Cd')
  })
  it('shows the first line statically when prefers-reduced-motion is set', () => {
    const matchMediaMock = (query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })
    const original = window.matchMedia
    window.matchMedia = matchMediaMock
    const { result } = renderHook(() =>
      useTypewriter(['Reduced', 'Motion'], {
        typingSpeedMs: 10,
      }),
    )
    act(() => vi.advanceTimersByTime(100))
    expect(result.current).toBe('Reduced')
    window.matchMedia = original
  })
})
