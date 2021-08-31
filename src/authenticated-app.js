import {Redirect, Route, Switch} from 'react-router-dom'
import {Home} from 'pages/home'
import {User} from 'pages/user'
import {DocumentTitle} from 'util/document-title'
import {AppLayout} from './layouts/app-layout'
import {MyAccount} from './pages/my-account'

function AppRoutespath() {
  return (
    <Switch>
      <Route exact path="/">
        <DocumentTitle title="Dashboard" />
        <Home />
      </Route>
      <Route path="/user">
        <DocumentTitle title="User" />
        <User />
      </Route>
      <Route path="/my-account">
        <DocumentTitle title="My Account" />
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
