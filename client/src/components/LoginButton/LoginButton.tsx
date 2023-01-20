
import { Component } from 'solid-js'
import { isAuthenticated, spotifyLogin, spotifyLogout } from '../../utils/login'
import spotifyLogo from '../../assets/spotify.svg'

import './LoginButton.css'

const LoginButton: Component = () => {
  return (
    <button
      class='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
      onClick={() => (isAuthenticated() ? spotifyLogout() : spotifyLogin())}
    >
      <div class='flex'>
        <img src={spotifyLogo} alt='spotifyLogo' class='h-[1.75rem] lg:h-[2rem] mr-2' />
        <p class="btnText text-lg lg:text-2xl">{isAuthenticated() ? 'Logout' : 'Login'}</p>
      </div>
    </button>
  )
}

export default LoginButton
