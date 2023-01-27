import { Component, Show } from 'solid-js'
import { Song } from '../../types/Song'
import { discardSong, setActiveSong } from '../../utils/song'
import Previewer from '../Previewer'
import { openModal } from '../SearchModal/SearchModal'

import editButton from '../../assets/edit_icon.svg'
import crossButton from '../../assets/not_allowed.svg'

interface SongProps {
  song: Song | null
  idx: number
}

const SongCard: Component<SongProps> = ({ song, idx }) => {
  return (
    <div class='lg:flex m-2 hidden w-full h-full'>
      <Show
        when={song !== null}
        fallback={
          <div
            class='flex w-[35vh] aspect-square justify-center items-center song-text shadow-md hover:cursor-pointer hover:scale-105 transition duration-250 rounded-lg'
            onClick={() => {
              setActiveSong(idx)
              openModal()
            }}
          >
            Select Song {idx + 1}
          </div>
        }
      >
        <div class='relative'>
          <img
            class='w-[35vh] aspect-square object-cover rounded-lg shadow-md hover:cursor-pointer hover:blur-[3px] transition duration-250'
            src={song.image}
            alt={song.name}
          />
          <div class='absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center text-white bg-gray-900 opacity-0 hover:opacity-100 transition duration-200 song-text rounded-lg'>
            <p class='text-xl px-2'>{song.name}</p>
            <div class='flex'>
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
      </Show>
    </div>
  )
}

export default SongCard
