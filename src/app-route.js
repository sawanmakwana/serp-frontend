import {Redirect, Route, Switch} from 'react-router-dom'
import {AppLayout} from 'layouts/app-layout'
import {Home} from 'pages/home'

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

function AppRoutes() {
  return (
    <AppLayout>
      <AppRoutespath />
    </AppLayout>
  )
}

export default AppRoutes
