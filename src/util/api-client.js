/* eslint-disable prefer-promise-reject-errors */
import {logout} from 'auth/auth-utils'
import {toast} from 'react-toastify'

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

  return fetch(`${apiURL}/${endpoint}`, config)
    .then(async response => {
      if (response.status === 403) {
        toast.error("You don't have access to this page or resource.")
        // await logout()
        // window.location.assign(window.location)
        // return Promise.reject({
        //   message: `You don't have access for this page`,
        // })
      }
      if (response.status === 401) {
        await logout()
        window.location.assign(window.location)
        // refresh the page for them
        return Promise.reject({message: 'Please re-authenticate.'})
      }
      const responseData = await response.json()
      if (response.ok) {
        return responseData
      }
      return Promise.reject(responseData)
    })
    .catch(err => {
      // console.log('catch')
    })
}
export {client}
