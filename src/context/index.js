/* eslint-disable no-console */
import * as React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {QueryClient, QueryClientProvider, MutationCache, QueryCache} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'

const mutationCache = new MutationCache({
  onError(error) {
    console.log(error.message)
  },
})

const queryCache = new QueryCache({
  onError(error) {
    console.log(error)
  },
})

const queryClient = new QueryClient({
  mutationCache,
  queryCache,
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      retry(failureCount, error) {
        if (error.statusCode === 404) return false
        if (failureCount < 2) return true
        return false
      },
    },
  },
})

function AppProviders({children}) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>{children}</Router>
      <ReactQueryDevtools position="bottom-right" initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export {AppProviders}
