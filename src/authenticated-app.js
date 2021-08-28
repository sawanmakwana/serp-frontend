import {Redirect, Route, Switch} from 'react-router-dom'
import {AppLayout} from 'layouts/app-layout'
import {Home} from 'pages/home'
import {HomeNew} from 'pages/home_new'

function AppRoutespath() {
  return (
    <Switch>
      <Route path="/home">
        <Home />
      </Route>
      <Route path="/dashboard">
        <HomeNew />
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
