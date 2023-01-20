import { useNavigate } from 'solid-app-router'
import { Component, createEffect, onMount } from 'solid-js'
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
    if (isAuthenticated()) {
      const navigate = useNavigate()
      navigate('/submit')
    }
  })

  return (
    <div class='flex justify-center items-center min-h-[100vh]'>
      <div class='flex flex-col bg-white rounded-xl justify-center items-center min-h-[85vh] w-[90vw] p-1'>
        <img
          src={plusxhubLogo}
          class='h-[12vh] lg:h-[17vh] mb-4 rounded-xl'
          alt='Plusxhub logo'
        />
        <Hero />
        <p class='subtext text-xl lg:text-3xl mt-3'>
          Show the world what you're listening to!
        </p>

        <div class='flex mt-2'>
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

          {/* <div class='infotexthover text-xl lg:text-3xl mb-4 bottom-[0.12rem]'> */}
          {/*   <span class='infotextwrapper'> */}
          {/*   </span> */}
          {/*   <a href='/info'>How does this work?</a> */}
          {/* </div> */}
        </div>
        <LoginButton />
      </div>
    </div>
  )
}

export default Home
