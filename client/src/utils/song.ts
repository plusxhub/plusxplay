import axios from 'axios'
import { createSignal } from 'solid-js'
import { Song } from '../types/Song'

const [searchResults, setSearchResults] = createSignal<Song[]>()
const searchTerm = 'In the name of love'

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

export { getSearchResults, searchResults }
