import {Redirect, Route, Switch} from 'react-router-dom'
import {Home} from 'pages/home'
import {AppLayout} from './layouts/app-layout'
import {MyAccount} from './components/my-account'

function AppRoutespath() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/user">
        <h1>Users</h1>
      </Route>
      <Route path="/my-account">
        <MyAccount />
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
