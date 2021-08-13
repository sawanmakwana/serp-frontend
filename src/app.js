import * as React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

const AppRoutes = React.lazy(() => import('./app-route'))

function App() {
  return (
    <React.Suspense
      fallback={
        <div className="spinner">
          <CircularProgress />
        </div>
      }
    >
      <AppRoutes />
    </React.Suspense>
  )
}

export {App}
