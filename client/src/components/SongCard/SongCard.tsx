import { Component, Show } from 'solid-js'
import { Song } from '../../types/Song'
import { setActiveSong } from '../../utils/song'
import { openModal } from '../SearchModal/SearchModal'

interface SongProps {
  song: Song | null
  idx: number
}

const SongCard: Component<SongProps> = ({ song, idx }) => {
  return (
    <div
      class='lg:flex m-2 hidden'
      onClick={() => {
        setActiveSong(idx)
        openModal()
      }}
    >
      <Show
        when={song !== null}
        fallback={<div class='w-full h-full bg-gray-400'>lode {idx + 1}</div>}
      >
        <img
          class='w-full h-full object-cover rounded-lg hover:scale-105 transition duration-250'
          src={song.image}
          alt={song.name}
        />
      </Show>
    </div>
  )
}

export default SongCard
