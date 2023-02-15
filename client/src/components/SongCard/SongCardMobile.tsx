import { Component, createSignal, Show } from 'solid-js'
import { Song } from '../../types/Song'
import editButton from '../../assets/edit_icon.svg'
import crossButton from '../../assets/not_allowed.svg'
import whiteSpotify from '../../assets/spotify_white.svg'

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
    <Show
      when={song !== null}
      fallback={
        <div class='flex items-center p-2 rounded-lg shadow-md lg:hidden w-full my-1'>
          <div
            class='flex h-24 w-full justify-center items-center text-xl song-text'
            onClick={() => {
              setActiveSong(idx)
              openModal()
            }}
          >
            <p>Select Song {idx + 1}</p>
          </div>
        </div>
      }
    >

      <div class='flex items-center p-2 rounded-lg shadow-md lg:hidden w-full my-1 bg-gray-800'>
        <div class='flex justify-center items-center relative w-full'>
          <a href={`https://open.spotify.com/track/${song.id}`} target="_blank">
            <img src={whiteSpotify} class="absolute top-2 right-2 w-5" />
          </a>
          <img
            src={song.image}
            alt={song.name}
            class='w-24 h-24 rounded-lg mr-6 object-contain'
          />

          <div class='w-full'>
            <p class='font-medium text-white font-[Urbanist]'>{truncateString(song.name, 25)}</p>
            <p class='text-gray-400 text-sm'>
              {truncateString(
                song.artists.map((artist) => artist.name).join(', '),
                30
              )}
            </p>
            <p class='text-gray-400 text-sm'>{song.release_date}</p>
            <div class="flex mt-2 mb-1">
              <Previewer songUrl={song.preview_url} idx={idx} />
              <button
                onClick={() => {
                  setActiveSong(idx)
                  openModal()
                }}
              >
                <img src={editButton} class='h-9 px-1' />
              </button>
              <button
                onClick={() => {
                  discardSong(idx)
                }}
              >
                <img src={crossButton} class='h-8 px-1' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Show>
  )
}

export default SongCardMobile
