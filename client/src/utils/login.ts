import axios from 'axios'
import { createEffect, createSignal } from 'solid-js'

const [isAuthenticated, setIsAuthenticated] = createSignal(false)

const [urlToken, setUrlToken] = createSignal(localStorage.getItem('token'))

createEffect(() => {
  localStorage.setItem('token', urlToken())
})

const spotifyLogin = () => {
  axios
    .get('http://localhost:8000/api/auth/url')
    .then((res) => {
      // console.log
      window.location = res.data.url
    })
    .catch((err) => {
      console.log(err)
    })
}

const spotifyLogout = () => {
  window.location = 'http://localhost:8000/api/auth/logout' as any
  // checkAuthenticationStatus()
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
    })
}

export {
  isAuthenticated,
  setIsAuthenticated,
  spotifyLogin,
  spotifyLogout,
  setUrlToken,
  checkAuthenticationStatus,
}
