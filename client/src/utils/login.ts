import axios from 'axios'
import { createSignal } from 'solid-js'

const [isAuthenticated, setIsAuthenticated] = createSignal(false)

const [urlToken, setUrlToken] = createSignal(localStorage.getItem('token'))

const spotifyLogin = () => {
  axios
    .get('http://localhost:8000/api/auth/url')
    .then((res) => {
      // console.log
      window.location.href = res.data.url
    })
    .catch((err) => {
      console.log(err)
    })
}

const spotifyLogout = () => {
  window.location.href = 'http://localhost:8000/api/auth/logout'
}

const checkAuthenticationStatus = () => {
  axios
    .get('http://localhost:8000/api/auth/is-authenticated', {
      withCredentials: true,
    })
    .then(({ data }) => {
      if (data.is_authenticated) {
        setIsAuthenticated(true)
      }
    })
    .catch((err) => {
      console.log(err)
      setIsAuthenticated(false)
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
}
