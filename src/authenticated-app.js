import {Redirect, Route, Switch} from 'react-router-dom'
import {Home} from 'pages/home'
import {AppLayout} from './layouts/app-layout'

function AppRoutespath() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/customers">
        <h1>customers</h1>
      </Route>

      <Redirect to="/" />
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
