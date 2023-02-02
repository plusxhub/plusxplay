import axios from 'axios'
import { createSignal } from 'solid-js'
import { Song } from '../types/Song'
import API_URL from './api'

const [searchResults, setSearchResults] = createSignal<Song[]>()

const selectedSongsLocal: string = localStorage.getItem('selectedSongs') || '[]'

const [activeSong, setActiveSong] = createSignal(0)

const [currentlyPreviewing, setCurrentlyPreviewing] = createSignal(null)

let selectedSongsLocalParsed: Array<Song | null>

if (selectedSongsLocal === '[]') {
  selectedSongsLocalParsed = new Array<Song | null>(10).fill(null)
  localStorage.setItem(
    'selectedSongs',
    JSON.stringify(selectedSongsLocalParsed)
  )
} else {
  selectedSongsLocalParsed = JSON.parse(selectedSongsLocal)
}

const [selectedSongs, setSelectedSongs] = createSignal<Song[]>(
  selectedSongsLocalParsed
)

const [searchTerm, setSearchTerm] = createSignal(null)

const truncateString = (originalString: string, maxLength: number) => {
  let truncatedString: string

  if (originalString.length > maxLength) {
    truncatedString = originalString.substring(0, maxLength) + '...'
  } else {
    truncatedString = originalString
  }
  return truncatedString
}

const getSearchResults = () => {
  if (searchTerm() === null) {
    return
  }

  let endpoint: string
  let params: object
  if (searchTerm() === '') {
    endpoint = '/spotify/recommend'
  } else {
    endpoint = '/spotify/search'
    params = {
      query: searchTerm(),
    }
  }

  axios
    .get(API_URL + endpoint, {
      params: params,
      withCredentials: true,
    })
    .then(({ data }) => {
      setSearchResults(data)
    })
    .catch((err) => {
      console.log(err)
    })
}

const discardSong = (idx: number) => {
  const songs = selectedSongs()
  songs[idx] = null
  setSelectedSongs([...songs])
  localStorage.setItem('selectedSongs', JSON.stringify(selectedSongs()))
}

export {
  getSearchResults,
  searchResults,
  truncateString,
  selectedSongs,
  setSelectedSongs,
  searchTerm,
  setSearchTerm,
  activeSong,
  setActiveSong,
  currentlyPreviewing,
  setCurrentlyPreviewing,
  discardSong,
}
