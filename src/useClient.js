import React from 'react'
import {useAuth} from 'context/auth-context'
import {client} from 'util/api-client'

function useClient() {
  const {user} = useAuth()
  const token = user?.token
  return React.useCallback((endpoint, config) => client(endpoint, {...config, token}), [token])
}

export {useClient}
