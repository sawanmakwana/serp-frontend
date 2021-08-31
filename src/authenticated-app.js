import {Redirect, Route, Switch} from 'react-router-dom'
import {Home} from 'pages/home'
import {User} from 'pages/user'
import {AppLayout} from './layouts/app-layout'
import {MyAccount} from './pages/my-account'

function AppRoutespath() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/user">
        <User />
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
