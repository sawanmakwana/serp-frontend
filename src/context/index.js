/* eslint-disable no-console */
import React, {useState} from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {QueryClient, QueryClientProvider, MutationCache, QueryCache} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
import {Snackbar} from '@material-ui/core'

function AppProviders({children}) {
  const [tost, settost] = useState(false)
  const [tostmsg, settostmsg] = useState('')

  const queryCache = new QueryCache({
    onError(error) {
      console.log(error)
      settost(true)
      settostmsg(error)
    },
  })

  const mutationCache = new MutationCache({
    onError(error) {
      console.log(error.message)
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
        {tost && <Snackbar open autoHideDuration={6000} message={tostmsg} key={new Date()} />}
        {children}
      </Router>
      <ReactQueryDevtools position="bottom-left" initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export {AppProviders}
