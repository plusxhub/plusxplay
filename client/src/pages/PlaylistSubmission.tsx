import {Box, Center, Container, Grid, GridItem, Text} from '@chakra-ui/react'
import SongContainer from "../components/SongContainer";
import SearchModal from "../components/SearchModal";

const PlaylistSubmission: React.FC = (): JSX.Element => {
    const items=['Item 1','Item 2','Item 3','Item 4','Item 5', 'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'];

  return (
    <div style={{ minHeight: '100vh', margin: '0' }}>
        <Container
          bg={'white'}
          rounded={'xl'}
          maxW='90vw'
          marginTop={'7vh'}
          marginY={'20px'}
          centerContent
          // className='vertical-center'
        >
            <SearchModal/>
        <Grid templateColumns={{base:"repeat(1,10fr)",md:"repeat(5,2fr)"}} gap={6} margin={'20px'}>
            {items.map((item, index) => {
                return (
                    <GridItem width={'100%'}>
                        <SongContainer />
                    </GridItem>
                )
            })}
        </Grid>
        </Container>
    </div>
  )
}

export default PlaylistSubmission
