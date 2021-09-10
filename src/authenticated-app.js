import {Redirect, Route, Switch} from 'react-router-dom'
import {PorjectList} from 'pages/project-list'
import {DocumentTitle} from 'util/document-title'
import {Dashbord} from 'pages/dashbord'
import {AppLayout} from './layouts/app-layout'

function AppRoutespath() {
  return (
    <Switch>
      <Route exact path="/">
        <DocumentTitle title="Dashboard" />
        <Dashbord />
      </Route>
      <Route exact path="/project">
        <DocumentTitle title="Project" />
        <PorjectList />
      </Route>
      {/* <Route path="/user">
        <DocumentTitle title="User" />
        <User />
      </Route>
      <Route path="/my-account">
        <DocumentTitle title="My Account" />
        <MyAccount />
      </Route> */}

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
