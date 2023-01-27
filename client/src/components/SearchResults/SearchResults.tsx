import { Component } from 'solid-js'
import { Song } from '../../types/Song'
import {
  activeSong,
  selectedSongs,
  setSearchTerm,
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
  setSelectedSongs([...songs])
  localStorage.setItem('selectedSongs', JSON.stringify(selectedSongs()))
  setSearchTerm('')
  closeModal()
}

const SearchResult: Component<SearchResultProps> = ({ song }) => {
  const artists: string = song.artists.map((artist) => artist.name).join(', ')
  return (
    <a
      class='flex w-full my-1 hover:cursor-pointer'
      onClick={() => handleResultClick(song)}
    >
      <div class='relative mx-2'>
        <img
          src={song.image}
          alt={song.name}
          class='w-12 h-12 rounded-lg mr-2 object-contain'
        />
      </div>
      <div>
        <p class='font-medium block lg:hidden whitespace-nowrap'>
          {truncateString(song.name, 24)}
        </p>
        <p class='font-medium hidden lg:block'>
          {truncateString(song.name, 40)}  {/* BUG: Fix for md devices */}

        </p>
        <p class='text-gray-600 text-sm'>{truncateString(artists,30)}</p>
      </div>
    </a>
  )
}

export default SearchResult
