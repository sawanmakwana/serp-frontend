import {Redirect, Route, Switch} from 'react-router-dom'
import {PorjectList} from 'pages/project-list'
import {SubProjectList} from 'pages/sub-project-list'
import {DocumentTitle} from 'util/document-title'
import {Dashbord} from 'pages/dashbord'
import {KeywordList} from 'pages/keyword-list'
import {User} from 'pages/user'
import {MyAccount} from 'pages/my-account'
import {getCompoAccess} from 'util/app-utill'
import {useContext} from 'react'
import {AppLayout} from './layouts/app-layout'
import {GlobalContext} from './context/global-context'

function AppRoutespath() {
  const {permissionLevel} = useContext(GlobalContext)

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
        <SubProjectList />
      </Route>
      <Route exact path="/project/:projectId/keyword/:subProjectId">
        <DocumentTitle title="Project Keyword" />
        <KeywordList />
      </Route>

      {getCompoAccess[permissionLevel]?.user && (
        <Route path="/user">
          <DocumentTitle title="User" />
          <User />
        </Route>
      )}
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
