import axios from 'axios'
import { createSignal } from 'solid-js'
import { Song } from '../types/Song'

const [searchResults, setSearchResults] = createSignal<Song[]>()

const selectedSongsLocal: string = localStorage.getItem('selectedSongs') || '[]'

const [activeSong, setActiveSong] = createSignal(0)

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

const [searchTerm, setSearchTerm] = createSignal('')

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
  if (searchTerm() === '') {
    return
  }
  axios
    .get('http://localhost:8000/api/spotify/search', {
      params: {
        query: searchTerm(),
      },
      withCredentials: true,
    })
    .then(({ data }) => {
      setSearchResults(data)
    })
    .catch((err) => {
      console.log(err)
    })
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
}
