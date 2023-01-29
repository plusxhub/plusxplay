import { useNavigate } from 'solid-app-router'
import { Component, For, onMount, Show } from 'solid-js'
import { Song } from '../../types/Song'
import { isAuthenticated } from '../../utils/login'
import { getSearchResults, selectedSongs } from '../../utils/song'
import backArrow from '../../assets/back_button.svg'
import Socials from '../../components/Socials'
import SongCardMobile from '../../components/SongCard/SongCardMobile'
import SongCard from '../../components/SongCard/SongCard'
import SearchModal from '../../components/SearchModal/SearchModal'
import axios from 'axios'
import API_URL from '../../utils/api'

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

  const renderSongs = (idx: number, song: Song | null) => {
    return (
      <div>
        <SongCardMobile song={song} idx={idx} />
        <SongCard song={song} idx={idx} />
      </div>
    )
  }

  const handleSubmission = () => {
    axios
      .post(
        API_URL + '/submit-playlist',
        {
          selectedSongs: selectedSongs(),
        },
        {
          withCredentials:true,
        }
      )
      .then((res) => {
        console.log(res)
        // Navigate to congrats page if res.ok
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div class='flex justify-center items-center min-h-[100vh] overflow-x-hidden'>
      <div class='flex flex-col my-[7vh] md:my-0 lg:my-0 bg-white rounded-xl items-center min-h-[85vh] w-[90vw] p-4 relative'>
        <div class='flex w-full justify-between my-1 2xl:mb-4 lg:mb-8'>
          <a href='/'>
            <img
              src={backArrow}
              alt='backArrow'
              class='top-4 left-4 h-[4vh] lg:h-[5vh]'
            />
          </a>
          <Socials />
        </div>
        <SearchModal />
        <div class='lg:grid md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1 justify-center items-center w-full'>
          <For each={selectedSongs()}>
            {(song: Song | null, idx) => renderSongs(idx(), song)}
          </For>
        </div>
        <Show
          when={selectedSongs().filter((val) => val === null).length === 0}
          fallback={
            <button
              disabled
              class='text-white bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2  dark:focus:ring-gray-700 dark:border-gray-700 mt-3 hover:cursor-not-allowed'
            >
              Select another{' '}
              {selectedSongs().filter((val) => val === null).length} songs
            </button>
          }
        >
          <button
            class='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-3'
            onClick={handleSubmission}
          >
            Submit
          </button>
        </Show>
      </div>
    </div>
  )
}

export default Submit
