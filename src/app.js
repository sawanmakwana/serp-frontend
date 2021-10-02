import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import {useAuth} from './context/auth-context'
import {GlobalContext} from './context/global-context'

const AuthenticatedApp = React.lazy(() => import('./authenticated-app'))
const UnauthenticatedApp = React.lazy(() => import('./unauthenticated-app'))

function App() {
  const {user} = useAuth()
  const [permissionLevel, setPermissionLevel] = React.useState()
  const userlocal = window.localStorage.getItem('__user_data__')
  const uservalue = JSON.parse(userlocal)

  React.useEffect(() => {
    setPermissionLevel(uservalue?.permissionLevel)
  }, [user, permissionLevel, uservalue])

  return (
    <React.Suspense
      fallback={
        <div className="spinner">
          <CircularProgress />
        </div>
      }
    >
      {user ? (
        <GlobalContext.Provider value={{permissionLevel, setPermissionLevel}}>
          <AuthenticatedApp />
        </GlobalContext.Provider>
      ) : (
        <UnauthenticatedApp />
      )}
    </React.Suspense>
  )
}

export {App}
