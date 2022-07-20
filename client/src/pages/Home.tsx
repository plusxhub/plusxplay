import { Button, Center, Container, Heading } from '@chakra-ui/react'
import React from 'react'

import { Link } from 'react-router-dom'
import LoginButton from '../components/LoginButton'

import '../App.css'
import useIsAuthenticated from '../hooks/useIsAuthenticated'

const Home: React.FC = (): JSX.Element => {

  const isAuthenticated = useIsAuthenticated()
  console.log(isAuthenticated)

  return (
    <div style={{ minHeight: '100vh', margin: '0' }}>
      <Center>
        <Container
          bg={'white'}
          rounded={'xl'}
          minH='85vh'
          maxW='90vw'
          centerContent
          className='vertical-center'
        >
          <Heading marginTop={'30px'} as='h2' size='2xl'>
            Your Mom's Playlist
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
      </Center>
    </div>
  )
}

export default Home
