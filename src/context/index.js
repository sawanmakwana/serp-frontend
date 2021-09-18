import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {QueryClient, QueryClientProvider, MutationCache, QueryCache} from 'react-query'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {AuthProvider} from './auth-context'

const queryCache = new QueryCache({
  onError(error) {
    toast.error(error.response.data.message)
  },
})

const mutationCache = new MutationCache({
  onError(error) {
    toast.error(error.response.data.message)
  },
  onSuccess({data}) {
    toast.success(data.message)
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
      <Router>
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
        />
        <AuthProvider>{children}</AuthProvider>
      </Router>
      {/* <ReactQueryDevtools position="bottom-left" initialIsOpen={false} /> */}
    </QueryClientProvider>
  )
}

export {AppProviders}
