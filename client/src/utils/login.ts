import axios from 'axios'
import { createSignal } from 'solid-js'
import API_URL from './api'

const [isAuthenticated, setIsAuthenticated] = createSignal(false)

const [isAdmin, setIsAdmin] = createSignal(false)

const [urlToken, setUrlToken] = createSignal(localStorage.getItem('token'))

const spotifyLogin = () => {
  axios
    .get(API_URL + '/auth/url')
    .then((res) => {
      // console.log
      window.location.href = res.data.url
    })
    .catch((err) => {
      console.log(err)
    })
}

const spotifyLogout = () => {
  window.location.href = API_URL + '/auth/logout'
}

const checkAuthenticationStatus = () => {
  axios
    .get(API_URL + '/auth/is-authenticated', {
      withCredentials: true,
    })
    .then(({ data }) => {
      if (data.is_authenticated) {
        setIsAuthenticated(true)
      }
      if (data.is_admin) {
        setIsAdmin(true)
      }
    })
    .catch((err) => {
      console.log(err)
      setIsAuthenticated(false)
      setIsAdmin(false)
    })
}

export {
  isAuthenticated,
  setIsAuthenticated,
  spotifyLogin,
  spotifyLogout,
  urlToken,
  setUrlToken,
  checkAuthenticationStatus,
  isAdmin,
}
