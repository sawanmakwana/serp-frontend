import React from 'react'

import {client} from 'utils/api-client'

function useClient() {
  return (endpoint, config) => client(endpoint, {...config})
}

export {useClient}
