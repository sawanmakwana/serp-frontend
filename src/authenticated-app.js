import {Redirect, Route, Switch} from 'react-router-dom'
import {AppLayout} from 'layouts/app-layout'
import {Home} from 'pages/home'
import DashboardLayout from 'pages/DashboardLayout'
import {HomeNewest} from 'pages/home-newest'
import {AppLayoutNew} from './layouts/app-layout-new'

function AppRoutespath() {
  return (
    <Switch>
      {/* <Route path="/home">
        <Home />
      </Route> */}
      {/* <Route path="/new_layout">
        <DashboardLayout />
      </Route> */}
      <Route path="/">
        <HomeNewest />
      </Route>

      <Redirect to="/" />
    </Switch>
  )
}

function AuthenticatedApp() {
  return (
    // <AppLayout>
    //   <AppRoutespath />
    // </AppLayout>
    <AppLayoutNew>
      <AppRoutespath />
    </AppLayoutNew>
  )
}

export default AuthenticatedApp
