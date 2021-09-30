import {logout} from 'auth/auth-utils'

const baseUrl = `${process.env.REACT_APP_PLATFORM_ENDPOINT}`

async function client(endpoint, {apiURL = baseUrl, data, token, headers: customHeaders, ...customConfig} = {}) {
  const headers = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  if (data) {
    headers['content-type'] = 'application/json'
  }
  const config = {
    method: data ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customHeaders,
    },
  }
  if (data) {
    config.body = JSON.stringify(data)
  }

  return fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    console.log(response)
    if (response.status === 401) {
      await logout()
      // console.log('loguot')
      // refresh the page for them
      window.location.assign(window.location)
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({message: 'Please re-authenticate.'})
    }
    const responseData = await response.json()
    if (response.ok) {
      // console.log(responseData)
      return responseData
    }
    return Promise.reject(responseData)
  })
  // .catch(er => console.log(er))
}
export {client}
