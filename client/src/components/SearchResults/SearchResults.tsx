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

import whiteSpotify from '../../assets/spotify_white.svg'

interface SearchResultProps {
  song: Song | null
}

const handleResultClick = (song: Song) => {
  const selectedIds = selectedSongs()
    .filter((selectedSong) => selectedSong !== null)
    .map((selectedSong) => selectedSong.id)
  if (selectedIds.includes(song.id)) {
    console.log('Chosen previously')
    closeModal()
    return // HACK: Add a message to why no same songs
  }
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
      class='flex relative w-full my-1 hover:cursor-pointer bg-[#272a2e] rounded-lg p-2'
      onClick={() => handleResultClick(song)}
    >
      <img src={whiteSpotify} class='absolute top-2 right-2 w-3' />
      <div class='relative mx-2'>
        <img
          src={song.image}
          alt={song.name}
          class='w-12 h-12 rounded-lg mr-2 object-contain'
        />
      </div>
      <div class=''>
        <p class='font-medium block lg:hidden whitespace-nowrap text-white'>
          {truncateString(song.name, 24)}
        </p>
        <p class='font-medium hidden lg:block text-white'>
          {truncateString(song.name, 40)} {/* BUG: Fix for md devices */}
        </p>
        <p class='text-gray-400 text-sm'>{truncateString(artists, 30)}</p>
      </div>
    </a>
  )
}

export default SearchResult
