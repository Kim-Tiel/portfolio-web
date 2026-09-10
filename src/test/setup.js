import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './mocks/server'

// MSW intercepts API calls at the network level for every test — real
// fetch/TanStack Query code runs, just against a mocked network response
// instead of a mocked hook.
beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
)
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// jsdom doesn't implement matchMedia — ThemeProvider (wraps the whole App)
// calls it to detect the OS color-scheme preference, so every test that
// mounts anything under App needs this stubbed.
window.matchMedia ??= (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})

// jsdom 30 on newer Node builds no longer ships a Web Storage implementation,
// so window.localStorage can be undefined. Provide a minimal in-memory shim.
if (!window.localStorage) {
  const store = new Map()
  window.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(String(k), String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    key: (i) => [...store.keys()][i] ?? null,
    get length() {
      return store.size
    },
  }
}

// Theme preference is persisted to localStorage — reset it between tests
// so one test's toggle doesn't leak into the next.
afterEach(() => window.localStorage.clear())

// jsdom doesn't implement IntersectionObserver (used for scroll-spy nav
// highlighting) or Element.scrollIntoView (used for the nav's smooth-scroll
// links) — stub both so components that call them don't crash in tests.
class MockIntersectionObserver {
  root = null
  rootMargin = ''
  scrollMargin = ''
  thresholds = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
window.IntersectionObserver ??= MockIntersectionObserver
Element.prototype.scrollIntoView ??= () => {}
