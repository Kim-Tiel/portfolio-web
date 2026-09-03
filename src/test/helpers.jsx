import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// A fresh QueryClient per test avoids cached results leaking between tests.
// retry: false so a mocked error response fails the query immediately
// instead of TanStack Query retrying it and slowing the test down.
export function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return function QueryWrapper({ children }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}
