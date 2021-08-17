/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {QueryClient, QueryClientProvider, MutationCache, QueryCache} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'

const queryCache = new QueryCache({
  onError(error) {
    console.log(error.response.data.message)
    // setToast(true)
    // setToasttype('error')
    // setToastmsg(error.response.data.message)
  },
})

const mutationCache = new MutationCache({
  onError(error) {
    console.log(error.response.data.message)
    // setToast(true)
    // setToasttype('error')
    // setToastmsg(error.response.data.message)
  },
  onSuccess({data}) {
    console.log(data.message)
    // setToast(true)
    // setToasttype('success')
    // setToastmsg(data.message)
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
  // const [toast, setToast] = useState(false)
  // const [toastmsg, setToastmsg] = useState('')
  // const [toastType, setToasttype] = useState('info')

  // function TransitionUp(props) {
  //   return <Slide {...props} direction="right" />
  // }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* <Snackbar
          open={toast}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          autoHideDuration={10000}
          TransitionComponent={TransitionUp}
          onClose={() => setToast(false)}
          key={new Date()}
        >
          <MuiAlert severity={toastType} elevation={6} variant="filled">
            {toastmsg}
          </MuiAlert>
        </Snackbar> */}
        {children}
      </Router>
      <ReactQueryDevtools position="bottom-left" initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export {AppProviders}
