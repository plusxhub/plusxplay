import { useNavigate } from 'solid-app-router'
import { Component, For, onMount } from 'solid-js'
import { Song } from '../../types/Song'
import SongCard from '../../components/SongCard'
import { isAuthenticated } from '../../utils/login'
import { getSearchResults, searchResults } from '../../utils/song'
import LoginButton from '../../components/LoginButton/LoginButton'

const Submit: Component = () => {
  onMount(() => {
    if (!isAuthenticated()) {
      const navigate = useNavigate()
      navigate('/')
    }
    getSearchResults()
  })

  return (
    <div class='flex justify-center items-center min-h-[100vh]'>
      <div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1 bg-white rounded-xl min-h-[85vh] w-[90vw] p-1 my-[5vh] justify-items-center'>
        <For each={searchResults()}>
          {(song: Song) => <SongCard song={song} />}
        </For>
        <LoginButton />
      </div>
    </div>
  )
}

export default Submit
