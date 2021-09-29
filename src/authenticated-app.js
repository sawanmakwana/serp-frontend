import {Redirect, Route, Switch} from 'react-router-dom'
import {PorjectList} from 'pages/project-list'
import {Project} from 'pages/project'
import {DocumentTitle} from 'util/document-title'
import {Dashbord} from 'pages/dashbord'
import {KeywordList} from 'pages/keyword-list'
import {User} from 'pages/user'
import {MyAccount} from 'pages/my-account'
import {AppLayout} from './layouts/app-layout'

function AppRoutespath() {
  return (
    <Switch>
      <Route exact path="/dashboard">
        <DocumentTitle title="Dashboard" />
        <Dashbord />
      </Route>
      <Route exact path="/project">
        <DocumentTitle title="Project" />
        <PorjectList />
      </Route>
      <Route exact path="/project/:projectId">
        <DocumentTitle title="Sub Project" />
        <Project />
      </Route>
      <Route exact path="/project/:projectId/keyword/:subProjectId">
        <DocumentTitle title="Project Keyword" />
        <KeywordList />
      </Route>
      <Route path="/user">
        <DocumentTitle title="User" />
        <User />
      </Route>
      <Route path="/my-account">
        <DocumentTitle title="My Account" />
        <MyAccount />
      </Route>

      <Redirect to="/dashboard" />
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
