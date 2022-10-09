import { Box, Button, Container, Flex, Heading, Image } from '@chakra-ui/react'

import { Link } from 'react-router-dom'
import LoginButton from '../../components/LoginButton'

import useIsAuthenticated from '../../hooks/useIsAuthenticated'
import plusxhub_logo from '../../../assets/plusxhub.jpg'

const Home: React.FC = (): JSX.Element => {
  const isAuthenticated = useIsAuthenticated()

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
          centerContent
          minHeight={'100%'}
        >
          <Image src={plusxhub_logo} height={'15vh'} marginBottom='10px' borderRadius={'lg'} />
          <Heading as='h2' size='2xl'>
            #PlusXPlay
          </Heading>

          <Heading as='h4' size='md' textAlign={'center'}>
            Show the world what you're listening to!
          </Heading>
          <LoginButton isAuthenticated={isAuthenticated} />

          {isAuthenticated ? (
            <Button>
              <Link to='/submit'>Submit a playlist</Link>
            </Button>
          ) : (
            'Please login to submit a playlist.'
          )}
        </Container>
      </Flex>
    </Flex>
  )
}

export default Home
