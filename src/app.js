/* eslint-disable no-console */
import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import {useAuth} from './context/auth-context'

const AuthenticatedApp = React.lazy(() => import('./authenticated-app'))
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'))

function App() {
  const {user} = useAuth()
  console.log(user)
  return (
    <React.Suspense
      fallback={
        <div className="spinner">
          <CircularProgress />
        </div>
      }
    >
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  )
}

export {App}
