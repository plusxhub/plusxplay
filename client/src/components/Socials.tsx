import { Component } from 'solid-js'
import instagramLogo from './../assets/insta_circle.svg'
import twitterLogo from './../assets/twitter_circle.svg'
import youtubeLogo from './../assets/youtube_circle.svg'
import infoIcon from './../assets/info.svg'

const Socials: Component = () => {
  return (
    <div class='flex justify-center items-center'>
      <a href='/info'>
        <img
          src={infoIcon}
          alt='Info Icon'
          class='max-h-[5vh] lg:max-h-[5vh] pr-2'
        />
      </a>
      <a href='https://instagram.com/plusxhub' target='_blank' rel='noreferrer'>
        <img
          src={instagramLogo}
          alt='Instagram'
          class='pr-2 max-h-[5vh] lg:max-h-[5vh] h-full w-full'
        />
      </a>

      <a href='https://youtube.com/@plusxhub' target='_blank' rel='noreferrer'>
        <img
          src={youtubeLogo}
          alt='Youtube'
          class='pr-2 max-h-[5vh] lg:max-h-[5vh] h-full w-full'
        />
      </a>

      <a
        href='https://twitter.com/martingarrixhub'
        target='_blank'
        rel='noreferrer'
      >
        <img
          src={twitterLogo}
          alt='Twitter'
          class='pr-2 max-h-[5vh] lg:max-h-[5vh] h-full'
        />
      </a>
    </div>
  )
}

export default Socials
