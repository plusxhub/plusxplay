import ISearchResults from '../types/SearchResults'

import { Box, chakra, Flex, HStack, Image } from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'

const SearchResult: React.FC<ISearchResults> = ({
  id,
  name,
  artists,
  release_date,
  image,
  preview_url,
}: ISearchResults) => {
  return (
      <Flex
        bg='white'
        _dark={{
          bg: 'gray.800',
        }}
        shadow='lg'
        rounded='lg'
        overflow='hidden'
        marginY={'10px'}
      >
          <Box w={1 / 3}>
            <Image src={image} alt={name} />
          </Box>

          <Box
            w={2 / 3}
            p={{
              base: 4,
              md: 4,
            }}
          >
            <chakra.h1
              fontSize='2xl'
              fontWeight='bold'
              color='gray.800'
              _dark={{
                color: 'white',
              }}
            >
              {name}
            </chakra.h1>

            <chakra.p
              mt={2}
              fontSize='sm'
              color='gray.600'
              _dark={{
                color: 'gray.400',
              }}
            >
              {artists.map((artist) => artist.name).join(', ')}
            </chakra.p>
            <chakra.p
              mt={2}
              fontSize='sm'
              color='gray.600'
              _dark={{
                color: 'gray.400',
              }}
            >
              {release_date}
            </chakra.p>
        </Box>
      </Flex>
  )
}

export default SearchResult
