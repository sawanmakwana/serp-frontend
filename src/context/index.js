/* eslint-disable no-console */
import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {QueryClient, QueryClientProvider, MutationCache, QueryCache} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const queryCache = new QueryCache({
  onError(error) {
    console.log(error.response.data.message)
    toast.error(error.response.data.message)
  },
})

const mutationCache = new MutationCache({
  onError(error) {
    console.log(error.response.data.message)
    toast.error(error.response.data.message)
  },
  onSuccess({data}) {
    console.log(data.message)
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
        {children}
      </Router>
      <ReactQueryDevtools position="bottom-left" initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export {AppProviders}
