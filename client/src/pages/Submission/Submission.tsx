import {
  Container,
  Flex,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import Song from '../../components/Song'
import ISong from '../../types/SearchResults'
import useChoices from '../../store/store'
import useIsAuthenticated from '../../hooks/useIsAuthenticated'

const PlaylistSubmission: React.FC = (): JSX.Element => {
  const selectedSongs = useChoices((state) => state.selectedSongs)
  useIsAuthenticated()

  return (
    <Flex style={{ minHeight: '100vh', margin: '0' }} justifyContent='center'>
      <Container
        bg={'white'}
        rounded={'xl'}
        minH='85vh'
        maxW='90vw'
        centerContent
        verticalAlign='middle'
        margin={'20px'}
      >
        <Grid
          templateColumns={{ base: 'repeat(1,10fr)', md: 'repeat(5,2fr)' }}
          gap={6}
          margin={'20px'}
        >
          {selectedSongs.map((item: ISong | null, index: number) => {
            return (
              <GridItem key={index} width={'100%'}>
                  <Song
                    song={item}
                    choice={index}
                  />
              </GridItem>
            )
          })}
        </Grid>
      </Container>
    </Flex>
  )
}

export default PlaylistSubmission
