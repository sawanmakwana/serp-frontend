import {authClient} from './auth-client'

function login(data) {
  return authClient('login', data)
}

function signUp(signUpData) {
  return authClient('', signUpData)
}

function domain(data) {
  return authClient('domain', data)
}

function forgotDomain(data) {
  return authClient('forgotdomain', data)
}

function forgotPassword(data) {
  return authClient('forgotpassword', data)
}

function logout() {
  window.localStorage.clear()
}

function getVerification(requestId) {
  return authClient(`verifications?requestId=${requestId}`)
}

function verifyUserWithOtp(data) {
  return authClient('verifications/verifyOtp', data)
}

function resendVerification() {
  return authClient('verifications/resend')
}

function setNewPassword(data) {
  return authClient('setpassword', data)
}

export {
  login,
  signUp,
  domain,
  forgotDomain,
  forgotPassword,
  logout,
  getVerification,
  verifyUserWithOtp,
  resendVerification,
  setNewPassword,
}
