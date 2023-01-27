import { Component, Show } from 'solid-js'
import { Song } from '../../types/Song'
import editButton from '../../assets/edit_icon.svg'
import crossButton from '../../assets/not_allowed.svg'

import { discardSong, setActiveSong, truncateString } from '../../utils/song'
import Previewer from '../Previewer'
import { openModal } from '../SearchModal/SearchModal'

import './SongCard.css'

interface SongProps {
  song: Song | null
  idx: number
}

const SongCardMobile: Component<SongProps> = ({ song, idx }) => {
  return (
    <div class='flex items-center p-2 rounded-lg shadow-md lg:hidden w-full'>
      <Show
        when={song !== null}
        fallback={
          <div
            class='flex h-24 w-full justify-center items-center text-xl song-text'
            onclick={() => {
              setActiveSong(idx)
              openModal()
            }}
          >
            <p>Select Song {idx + 1}</p>
          </div>
        }
      >
        <div class='flex justify-center items-center relative w-full'>
          <img
            src={song.image}
            alt={song.name}
            class='w-24 h-24 rounded-lg mr-6 object-contain'
          />

          <div class='w-full'>
            <p class='font-medium'>{truncateString(song.name, 18)}</p>
            <p class='text-gray-600 text-sm'>
              {truncateString(
                song.artists.map((artist) => artist.name).join(', '),
                30
              )}
            </p>
            <p class='text-gray-600 text-sm'>{song.release_date}</p>
          </div>
          <div class='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-white bg-gray-900 opacity-0 hover:opacity-100 transition duration-200 song-text rounded-lg'>
            <Previewer songUrl={song.preview_url} idx={idx} />
            <button
              onClick={() => {
                setActiveSong(idx)
                openModal()
              }}
            >
              <img src={editButton} class='h-10 px-1' />
            </button>
            <button
              onClick={() => {
                discardSong(idx)
              }}
            >
              <img src={crossButton} class='h-9 px-1' />
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default SongCardMobile
