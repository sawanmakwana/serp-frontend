import * as React from 'react'
import {useQueryClient} from 'react-query'

import {logout as authLogout} from 'auth/auth-methods'
import {getToken, getUser, localStorageKey, userKey} from 'auth/auth-utils'

const authContext = React.createContext()
authContext.displayName = 'AuthContext'

function AuthProvider(props) {
  const [user, setUser] = React.useState(null)
  const queryClient = useQueryClient()

  React.useEffect(() => {
    const token = getToken()
    if (token) {
      const userData = getUser()
      setUser({
        token,
        user: JSON.parse(userData),
      })
    }
  }, [])

  const login = React.useCallback(data => {
    const {token, ...userData} = data
    console.log(token)

    window.localStorage.setItem(localStorageKey, token)
    const userInfo = JSON.stringify(userData)
    window.localStorage.setItem(userKey, userInfo)

    setUser(data)
  }, [])

  const logout = React.useCallback(() => {
    queryClient.clear()
    authLogout()
    setUser(null)
  }, [queryClient])

  const value = React.useMemo(() => ({login, logout, user}), [login, logout, user])

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <authContext.Provider value={value} {...props} />
}

function useAuth() {
  const context = React.useContext(authContext)

  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }

  return context
}

export {AuthProvider, useAuth}
