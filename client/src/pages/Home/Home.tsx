import { Component, createEffect, onMount, Show } from 'solid-js'
import plusxhubLogo from '../../../src/assets/plusxhub.jpg'
import infoIcon from '../../../src/assets/info.svg'
import Hero from '../../components/Hero/Hero'
import {
  checkAuthenticationStatus,
  isAuthenticated,
  setUrlToken,
} from '../../utils/login'
import LoginButton from '../../components/LoginButton/LoginButton'

import './Home.css'
import Socials from '../../components/Socials'
import SearchModal from '../../components/SearchModal/SearchModal'
import {urlToken} from '../../utils/login'

const Home: Component = () => {
  onMount(() => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const token = urlParams.get('token')
    if (token !== null) {
      setUrlToken(token)
      window.location.href = '/'
    }

    checkAuthenticationStatus()
  })


  createEffect(() => {
    localStorage.setItem('token', urlToken())
  })

  return (
    <div class='flex justify-center items-center min-h-[100vh]'>
      <div class='flex flex-col bg-white rounded-xl justify-center items-center min-h-[85vh] max-h-[85vh] w-[90vw] p-1 relative'>
        <span class="absolute top-4 right-4">
          <Socials />
        </span>
        <img
          src={plusxhubLogo}
          class='h-[12vh] lg:h-[17vh] mb-4 rounded-xl'
          alt='Plusxhub logo'
        />
        <Hero />
        <p class='subtext text-xl lg:text-3xl mt-3'>
          Show the world what you're listening to!
        </p>

        <div class='flex sm: mt-1 lg:mt-2'>
          <img
            src={infoIcon}
            alt='Info Icon'
            class='h-[1.5rem] lg:h-[2.0rem] mr-2'
          />

          <a
            href='/info'
            class='group transition duration-300 ease-in-out hover:text-accent/70 infotexthover text-xl lg:text-3xl mb-4 bottom-[0.12rem]'
          >
            How does this work?
            <span class='block bg-[#ff8208] h-0.5 lg:h-0.75 max-w-0 transition-all duration-500 group-hover:max-w-full '></span>
          </a>
        </div>
        <SearchModal />
        <Show when={isAuthenticated()} fallback={<LoginButton />}>
          <div class='flex flex-wrap justify-center'>
            <a
              href='/submit'
              class='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
            >
              <p class='btnText text-lg lg:text-2xl'>🎵 Submit a playlist!</p>
            </a>
            <LoginButton />
          </div>
        </Show>
      </div>
    </div>
  )
}

export default Home
