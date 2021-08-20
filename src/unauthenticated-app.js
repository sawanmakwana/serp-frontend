import {SignIn} from 'pages/signin'
import {Redirect, Route, Switch} from 'react-router-dom'

function UnauthenticatedApp() {
  return (
    <Switch>
      <Route path="/signin">
        <SignIn />
      </Route>

      <Redirect to="/signin" />
    </Switch>
  )
}

export default UnauthenticatedApp
