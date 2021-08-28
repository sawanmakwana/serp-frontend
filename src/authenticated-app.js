import {Redirect, Route, Switch} from 'react-router-dom'
import {AppLayout} from 'layouts/app-layout'
import {Home} from 'pages/home'
import DashboardLayout from 'pages/DashboardLayout'

function AppRoutespath() {
  return (
    <Switch>
      <Route path="/home">
        <Home />
      </Route>
      <Route path="/new_layout">
        <DashboardLayout />
      </Route>

      <Redirect to="/new_layout" />
    </Switch>
  )
}

function AuthenticatedApp() {
  return (
    // <AppLayout>
    //   <AppRoutespath />
    // </AppLayout>
    <AppRoutespath />
  )
}

export default AuthenticatedApp
