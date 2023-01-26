import { useNavigate } from 'solid-app-router'
import { Component, For, onMount } from 'solid-js'
import { Song } from '../../types/Song'
import { isAuthenticated } from '../../utils/login'
import { getSearchResults, searchResults } from '../../utils/song'
import backArrow from '../../assets/back_button.svg'
import Socials from '../../components/Socials'
import SongCardMobile from '../../components/SongCard/SongCardMobile'
import SongCard from '../../components/SongCard/SongCard'

const Submit: Component = () => {
  onMount(() => {
    // BUG: Navigating me back even when authenticated on refresh
    if (!isAuthenticated()) {
      const navigate = useNavigate()
      navigate('/')
    } else {
      getSearchResults()
    }
  })

  const renderSongs = (song: Song) => {
    return (
      <div>
        <SongCardMobile song={song} />
        <SongCard song={song} />
      </div>
    )
  }

  return (
    <div class='flex justify-center items-center min-h-[100vh] overflow-x-hidden'>
      <div class='flex flex-col my-[7vh] lg:my-0 bg-white rounded-xl justify-center items-center min-h-[85vh] w-[90vw] p-4'>
        <div class='flex w-full justify-between my-1 '>
          <a href='/'>
            <img
              src={backArrow}
              alt='backArrow'
              class='top-4 left-4 h-[4vh] lg:h-[5vh]'
            />
          </a>
          <Socials />
        </div>
        <div class='lg:grid md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1 justify-center items-center w-full'>
          <For each={searchResults()}>{(song: Song) => renderSongs(song)}</For>
        </div>
        <button class='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-3'>
          Lulli
        </button>
      </div>
    </div>
  )
}

export default Submit
