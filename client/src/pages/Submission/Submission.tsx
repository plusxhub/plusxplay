import { Container, Image, Flex, Grid, GridItem, Button } from '@chakra-ui/react'
import Song from '../../components/Song'
import ISong from '../../types/SearchResults'
import useChoices from '../../store/store'
import useIsAuthenticated from '../../hooks/useIsAuthenticated'
import back_arrow from '../../../assets/back_arrow.svg'
import { Link, useNavigate } from "react-router-dom";

const PlaylistSubmission: React.FC = (): JSX.Element => {
  const selectedSongs = useChoices((state) => state.selectedSongs)
  let navigate = useNavigate();
  useIsAuthenticated()

  const submitSongs = () => {
    console.log(selectedSongs)
  }

  const backButton = () => {
    navigate("/")
  }

  return (
    <Flex
      minHeight={'100vh'}
      justifyContent='center'
      alignItems='center'
    >
      <Flex
        bg={'white'}
        rounded={'xl'}
        justifyContent='center'
        alignItems='center'
        minHeight={'85vh'}
        width={'90vw'}
        height={"100%"}
      >
        <Container
          className="lodu"
          centerContent
          minHeight={'100%'}
          minWidth={'100%'}
        >
          <Image
            width="30px"
            src={back_arrow}
            alignSelf="flex-start"
            marginTop='15px'
            onClick={() => backButton()}
          />
          <Grid
            templateColumns={{ base: 'repeat(1,10fr)', md: 'repeat(5,2fr)' }}
            gap={6}
            margin={'20px'}
          >
            {selectedSongs.map((item: ISong | null, index: number) => {
              return (
                <GridItem key={index} width={'100%'}>
                  <Song song={item} choice={index} />
                </GridItem>
              )
            })}
          </Grid>
          <Button marginBottom={'10px'} onClick={() => {
            submitSongs()
          }}>
            Submit
          </Button>
        </Container>
      </Flex>
    </Flex>
  )
}

export default PlaylistSubmission
