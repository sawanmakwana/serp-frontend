import {Redirect, Route, Switch} from 'react-router-dom'
import {AppLayout} from 'layouts/app-layout'
import {Home} from 'pages/home'
import {SignIn} from 'pages/signin'

function AppRoutespath() {
  return (
    <Switch>
      <Route path="/home">
        <Home />
      </Route>
      <Route path="/signin">
        <SignIn />
      </Route>

      <Redirect to="/signin" />
    </Switch>
  )
}

function AppRoutes() {
  return (
    <AppLayout>
      <AppRoutespath />
    </AppLayout>
  )
}

export default AppRoutes
