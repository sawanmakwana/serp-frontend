const localStorageKey = '__serp_token__'
const userKey = '__user_data__'

function getToken() {
  return window.localStorage.getItem(localStorageKey)
}

function getUser() {
  return window.localStorage.getItem(userKey)
}

export {localStorageKey, userKey, getToken, getUser}
