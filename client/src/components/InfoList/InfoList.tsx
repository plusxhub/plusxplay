import { Component } from 'solid-js'
import './InfoList.css'

const InfoList: Component = () => {
  return (
    <ol class="numbered live my-0 lg:my-8">
      <li class='flex fade-item text-xl lg:text-3xl mb-4'>
        <a
          href='https://open.spotify.com/playlist/3COgB78xhNqPCASjmQF8A6'
          target='_blank'
          rel='noreferrer'
        >
          Open the #PlusXPlay playlist on&nbsp
          <u class='playlistBtn'>Spotify</u>
        </a>
      </li>
      <li class='flex fade-item text-xl lg:text-3xl mb-4'>
        Follow and Listen to the playlist
      </li>
      <li class='flex fade-item text-xl lg:text-3xl mb-4'>
        Follow the steps to get a chance to make your playlist
      </li>
    </ol>
  )
}

export default InfoList
