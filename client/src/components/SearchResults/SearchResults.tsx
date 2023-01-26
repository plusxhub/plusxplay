import { Component } from 'solid-js'
import { Song } from '../../types/Song'
import {
  activeSong,
  selectedSongs,
  setSelectedSongs,
  truncateString,
} from '../../utils/song'
import { closeModal } from '../SearchModal/SearchModal'

interface SearchResultProps {
  song: Song | null
}

const handleResultClick = (song: Song) => {
  const songs = selectedSongs()
  songs[activeSong()] = song
  setSelectedSongs(songs)
  closeModal()
}

const SearchResult: Component<SearchResultProps> = ({ song }) => {
  return (
    <a
      class='flex w-full my-1 hover:cursor-pointer'
      onClick={() => handleResultClick(song)}
    >
      <div class='relative mx-2'>
        <img
          src={song.image}
          alt={song.name}
          class='w-12 h-12 rounded-lg mr-6 object-contain'
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
      </div>
    </a>
  )
}

export default SearchResult
