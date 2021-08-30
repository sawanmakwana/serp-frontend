import {Redirect, Route, Switch} from 'react-router-dom'
import {Home} from 'pages/home'
import {AppLayoutNew} from './layouts/app-layout-new'

function AppRoutespath() {
  return (
    <Switch>
      {/* <Route path="/home">
        <Home />
      </Route> */}
      <Route path="/">
        <Home />
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
