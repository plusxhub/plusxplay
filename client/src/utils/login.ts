import axios from 'axios'
import { createSignal } from 'solid-js'
import { User } from '../types/User'
import API_URL from './api'

const [isAuthenticated, setIsAuthenticated] = createSignal(false)

const [isAdmin, setIsAdmin] = createSignal(false)

const [urlToken, setUrlToken] = createSignal(localStorage.getItem('token'))

const [currentUser, setCurrentUser] = createSignal<User>(null)

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

        const user: User = {
          SpotifyID: data.user.SpotifyID,
          DisplayName: data.user.displayName,
          ProfileImageUrl: data.user.imageUrl.String || ''
        }
        setCurrentUser(user)
      }
      if (data.is_admin) {
        setIsAdmin(true)
      }
    })
    .catch((err) => {
      console.log(err)
      setIsAuthenticated(false)
      setIsAdmin(false)
      setCurrentUser(null)
    })
}

const adminLogin = () => {
  axios
    .get(API_URL + '/admin/url')
    .then((res) => {
      // console.log
      window.location.href = res.data.url
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
  urlToken,
  setUrlToken,
  checkAuthenticationStatus,
  isAdmin,
  adminLogin,
  currentUser,
}
