import { Component, Show } from 'solid-js'
import { Song } from '../../types/Song'
import { discardSong, setActiveSong, truncateString } from '../../utils/song'
import Previewer from '../Previewer'
import { openModal } from '../SearchModal/SearchModal'

import editButton from '../../assets/edit_icon.svg'
import crossButton from '../../assets/not_allowed.svg'
import whiteSpotify from '../../assets/spotify_white.svg'

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
            class="empty-box hover:scale-105 transition duration-250 rounded-lg"
            onClick={() => {
              setActiveSong(idx)
              openModal()
            }}
          >
            Select Song {idx + 1}
          </div>
        }
      >
        <div class='song-box relative bg-[#272a2e]'>
          <a href={`https://open.spotify.com/track/${song.id}`} target="_blank">
            <img src={whiteSpotify} class="absolute top-3 right-3 w-6" />
          </a>
          <img class="song-box-image " src={song.image} />
          <a href={`https://open.spotify.com/track/${song.id}`} class="song-box-text hover:underline" target="_blank">{truncateString(song.name, 25)}</a>
          <span class="flex self-start">
            {
              song.artists.map((artist, index) => (
                <a href={`https://open.spotify.com/artist/${artist.id}`} class="font-[Urbanist] font-medium">
                  <p class='text-gray-400 text-sm font-semibold'>
                    {artist.name}{index !== song.artists.length - 1 ? ',' : ''}&nbsp
                  </p>
                </a>
              ))
            }
          </span>
          <div class="flex mt-2">
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
      </Show>
    </div>
  )
}

export default SongCard
