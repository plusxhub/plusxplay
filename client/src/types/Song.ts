export type Song = {
  id: string
  name: string
  artists: Artist[]
  release_date: string
  image: string
  preview_url: string
}

type Artist = {
  id: number
  name: string
}
