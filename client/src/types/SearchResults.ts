export default interface ISearchResult {
  id: number
  name: string
  artists: Artist[]
  release_date: string
  image: string
  preview_url: string
}

interface Artist {
  id: number
  name: string
}
