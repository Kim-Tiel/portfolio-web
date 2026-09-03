import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useCursorSpotlight } from './useCursorSpotlight'
function fakeMouseEvent(clientX, clientY) {
  const currentTarget = {
    getBoundingClientRect: () => ({
      left: 0,
      top: 0,
    }),
  }
  return {
    clientX,
    clientY,
    currentTarget,
  }
}
describe('useCursorSpotlight', () => {
  it('writes the pointer position onto the spotlight ref on move and reveals it', () => {
    const { result } = renderHook(() => useCursorSpotlight())
    const node = document.createElement('div')
    result.current.spotlightRef.current = node
    result.current.handleMouseMove(fakeMouseEvent(120, 80))
    expect(node.style.left).toBe('120px')
    expect(node.style.top).toBe('80px')
    expect(node.style.opacity).toBe('1')
  })
  it('does nothing when the ref has no node yet', () => {
    const { result } = renderHook(() => useCursorSpotlight())
    expect(() => result.current.handleMouseMove(fakeMouseEvent(10, 10))).not.toThrow()
  })
})
