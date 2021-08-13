import * as React from 'react'

const AppRoutes = React.lazy(() => import('./app-route'))

function App() {
  return (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <AppRoutes />
    </React.Suspense>
  )
}

export {App}
