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
import { User } from '../../types/User'
import {
  currentWinner,
  getWinnerFromData,
  setCurrentWinner,
} from '../../utils/winner'

const Admin: Component = () => {
  const navigate = useNavigate()

  onMount(() => {
    if (!isAdmin()) {
      const navigate = useNavigate()
      navigate('/')
    }

    axios
      .get(API_URL + '/admin/current-winner', {
        withCredentials: true,
      })
      .then(({ data }) => {
        const winner = getWinnerFromData(data)
        setCurrentWinner(winner)
      })
      .catch((err) => {
        console.log(err)
      })
  })

  const chooseWinner = () => {
    axios
      .get(API_URL + '/admin/random-playlist', {
        withCredentials: true,
      })
      .then(({ data }) => {
        const winner = getWinnerFromData(data)
        setCurrentWinner(winner)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // TODO: Add a clear winner option

  const setWinner = () => {
    axios
      .post(API_URL + '/admin/set-playlist', {}, { withCredentials: true })
      .then(({ data }) => {
        if (data.msg == 'Playlist has been set successfully.') {
          console.log('Success')
          navigate('/winner')
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
          fallback={<p class='russo text-4xl mb-4'>No winner selected</p>}
        >
          <p class='russo text-xl lg:text-3xl'>
            Current Winner is: {currentWinner().User.DisplayName} The playlist
            was last updated on{' '}
            {new Date(
              currentWinner().Playlist.UpdatedAt.toString()
            ).toLocaleString() + ' UTC'}
          </p>
          <Show when={currentWinner().User.ProfileImageUrl !== ''}>
            <img
              class='my-2 rounded-lg'
              src={currentWinner().User.ProfileImageUrl}
            />
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
