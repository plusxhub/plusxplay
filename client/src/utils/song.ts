import axios from 'axios'
import { createEffect, createSignal } from 'solid-js'
import { Song } from '../types/Song'

const [searchResults, setSearchResults] = createSignal<Song[]>()

const [selectedSongs, setSelectedSongs] = createSignal<Song[]>()
const searchTerm = 'Martin Garrix'

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
  console.log('getting search results')
  axios
    .get('http://localhost:8000/api/spotify/search', {
      params: {
        query: searchTerm,
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

export { getSearchResults, searchResults, truncateString }
