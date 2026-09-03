import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useProfileQuery } from './profile'
import { createQueryWrapper } from '../test/helpers'
import { mockProfile } from '../test/mocks/handlers'
describe('useProfileQuery', () => {
  it('fetches the profile via the mocked API', async () => {
    const { result } = renderHook(() => useProfileQuery(), {
      wrapper: createQueryWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockProfile)
  })
})
