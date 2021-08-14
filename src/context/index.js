/* eslint-disable no-console */
import React, {useState} from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {QueryClient, QueryClientProvider, MutationCache, QueryCache} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
import {Snackbar} from '@material-ui/core'

function AppProviders({children}) {
  const [toast, setToast] = useState(false)
  const [toastmsg, setToastmsg] = useState('')

  const queryCache = new QueryCache({
    onError(error) {
      console.log(error.response.data.message)
      setToast(true)
      setToastmsg(error.response.data.message)
    },
  })

  const mutationCache = new MutationCache({
    onError(error) {
      console.log(error.response.data.message)
      setToast(true)
      setToastmsg(error.response.data.message)
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

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {toast && (
          <Snackbar
            open={toast}
            autoHideDuration={6000}
            onClose={() => setToast(false)}
            message={toastmsg}
            key={new Date()}
          />
        )}
        {children}
      </Router>
      <ReactQueryDevtools position="bottom-left" initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export {AppProviders}
