import {Redirect, Route, Switch} from 'react-router-dom'
import {Home} from 'pages/home'
import {AppLayout} from './layouts/app-layout'

function AppRoutespath() {
  return (
    <Switch>
      <Route path="/home">
        <Home />
      </Route>

      <Redirect to="/home" />
    </Switch>
  )
}

function AuthenticatedApp() {
  return (
    <AppLayout>
      <AppRoutespath />
    </AppLayout>
  )
}

export default AuthenticatedApp
