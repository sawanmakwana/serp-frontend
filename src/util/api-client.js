const baseUrl = `${process.env.REACT_APP_PLATFORM_ENDPOINT}/v1/guide`

async function client(endpoint, {apiURL = baseUrl, data, headers: customHeaders, ...customConfig} = {}) {
  const headers = {}
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
  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    const responseData = await response.json()
    if (response.ok) {
      return responseData.payload
    }
    return Promise.reject(responseData)
  })
}
export {client}
