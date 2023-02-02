import { Component, createSignal, onMount, Show } from 'solid-js'
import backArrow from '../../assets/back_button.svg'
import './Admin.css'
import Socials from '../../components/Socials'
import { isAdmin } from '../../utils/login'
import { useNavigate } from 'solid-app-router'
import axios from 'axios'
import API_URL from '../../utils/api'
import { Winner } from '../../types/Winner'
import { Playlist } from '../../types/Playlist'

const Admin: Component = () => {
  onMount(() => {
    if (!isAdmin()) {
      const navigate = useNavigate()
      navigate('/')
    }
  })

  const [currentWinner, setCurrentWinner] = createSignal<Winner>(null)

  const chooseWinner = () => {
    axios
      .get(API_URL + '/admin/random-playlist', {
        withCredentials: true,
      })
      .then(({ data }) => {
        const playlist: Playlist = {
          Choice1: data.choice1 as string,
          Choice2: data.choice2 as string,
          Choice3: data.choice3 as string,
          Choice4: data.choice4 as string,
          Choice5: data.choice5 as string,
          Choice6: data.choice6 as string,
          Choice7: data.choice7 as string,
          Choice8: data.choice8 as string,
          Choice9: data.choice9 as string,
          Choice10: data.choice10 as string,
          UpdatedAt: data.updatedAt as Date,
        }

        const winner: Winner = {
          SpotifyID: data.spotifyID,
          DisplayName: data.displayName,
          ImageUrl: data.imageUrl.Valid ? data.imageUrl.String : '',
          Playlist: playlist,
        }

        setCurrentWinner(winner)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const setWinner = () => {
    axios
      .post(
        API_URL + '/admin/set-playlist?winner=' + currentWinner().SpotifyID,
        {},
        { withCredentials: true }
      )
      .then(({ data }) => {
        if (data.msg !== '') {
          console.log(data.msg)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div class='flex justify-center items-center min-h-[100vh]'>
      {/* TODO: Add the flat logo */}
      <div class='flex flex-col bg-white rounded-xl justify-center min-h-[85vh] w-[90vw] p-8 relative items-center'>
        <span class='absolute top-4 right-4'>
          <Socials />
        </span>
        <a href='/'>
          <img
            src={backArrow}
            alt='backArrow'
            class='absolute top-4 left-4 h-[4vh] lg:h-[5vh]'
          />
        </a>

        <Show
          when={currentWinner() !== null}
          fallback={<div>No winner Selected</div>}
        >
          CurrentWinner is: {currentWinner().DisplayName} The playlist was last
          updated on {currentWinner().Playlist.UpdatedAt.toString()}
          <Show when={currentWinner().ImageUrl !== ''}>
            <img class='my-2' src={currentWinner().ImageUrl} />
          </Show>
        </Show>

        <button
          class='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
          onClick={chooseWinner}
        >
          <p class='btnText text-lg lg:text-2xl'>
            {currentWinner() === null ? 'Choose a winner!' : 'Choose again!'}
          </p>
        </button>

        <Show when={currentWinner() !== null}>
          <button
            class='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
            onClick={setWinner}
          >
            <p class='btnText text-lg lg:text-2xl'>Set Playlist!</p>
          </button>
        </Show>
      </div>
    </div>
  )
}

export default Admin
