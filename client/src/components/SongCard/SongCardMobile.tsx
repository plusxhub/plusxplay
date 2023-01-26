import { Component, Show } from 'solid-js'
import { Song } from '../../types/Song'
// import playButton from '../../assets/play_button.svg'
// import pauseButton from '../../assets/pause_button.svg'
import { setActiveSong, truncateString } from '../../utils/song'
import { openModal } from '../SearchModal/SearchModal'

import './SongCard.css'

interface SongProps {
  song: Song | null
  idx: number
}

const SongCardMobile: Component<SongProps> = ({ song, idx }) => {
  return (
    <div
      class='flex items-center p-2 rounded-lg shadow-md lg:hidden w-full'
      onClick={() => {
        setActiveSong(idx)
        openModal()
      }}
    >
      <Show
        when={song !== null}
        fallback={
          <div class='flex h-24 w-full justify-center items-center text-xl song-text'>
            <p>Select Song {idx + 1}</p>
          </div>
        }
      >
        <div class='relative'>
          <img
            src={song.image}
            alt={song.name}
            class='w-24 h-24 rounded-lg mr-6 object-contain'
          />
        </div>
        <div>
          <p class='font-medium'>{truncateString(song.name, 18)}</p>
          <p class='text-gray-600 text-sm'>
            {truncateString(
              song.artists.map((artist) => artist.name).join(', '),
              30
            )}
          </p>
          <p class='text-gray-600 text-sm'>{song.release_date}</p>
        </div>
      </Show>
    </div>
  )
}

export default SongCardMobile
