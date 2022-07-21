import ISearchResults from '../types/SearchResults'

import { Image } from '@chakra-ui/react'

function SearchResult({
  id,
  name,
  artists,
  release_date,
  image,
  preview_url,
}: ISearchResults): JSX.Element {
  return (
    <>
      <Image src={image} alt={name} maxH={'100px'} />
    </>
  )
}

export default SearchResult
