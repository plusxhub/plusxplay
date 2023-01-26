import { Component } from 'solid-js'
import plusxhubLogo from '../../assets/plusxhub.jpg'
import backArrow from '../../assets/back_button.svg'
import './Info.css'
import InfoList from '../../components/InfoList/InfoList'
import Socials from '../../components/Socials'

const Info: Component = () => {
  return (
    <div class='flex justify-center items-center min-h-[100vh]'>
      {/* TODO: Add the flat logo */}
      <div class='flex flex-col bg-white rounded-xl justify-center min-h-[85vh] w-[90vw] p-8 relative'>
        <span class="absolute top-4 right-4">
          <Socials />
        </span>
        <a href='/'>
          <img
            src={backArrow}
            alt='backArrow'
            class='absolute top-4 left-4 h-[4vh] lg:h-[5vh]'
          />
        </a>
        <img
          src={plusxhubLogo}
          class='h-[8vh] lg:h-[12vh] mb-4 rounded-xl fade-title self-center'
          alt='Plusxhub logo'
        />
        <p class='subtext text-2xl lg:text-4xl mb-4 fade-title self-center'>
          Here's how you can be the next one to curate&nbsp
          <text class='gradright'>#PlusXPlay</text>
        </p>
        <div class='px-3 lg:px-10'>
          <InfoList />
        </div>
      </div>
    </div>
  )
}

export default Info
