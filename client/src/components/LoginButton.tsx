import axios from 'axios'
import { useNavigate } from 'react-router'
import { Button, Image } from '@chakra-ui/react'
import spotify_logo from '../../assets/spotify.svg'
import { useEffect } from 'react'
import LoginButtonProps from '../types/LoginButton'

function LoginButton({ isAuthenticated }: LoginButtonProps): JSX.Element {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      // navigate('/form')
    } else {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  return (
    <>
      <Button
        margin={'10px'}
        background={'blackAlpha.800'}
        color={'whiteAlpha.900'}
        // _hover={{ background: 'blackAlpha.700' }}
        onClick={() => {
          isAuthenticated ? logout() : spotifyLogin()
        }}
      >
        <Image
          paddingX={'5px'}
          src={spotify_logo}
          alt='Spotify logo'
          maxH={'20px'}
        />
        {isAuthenticated ? 'Logout' : 'Login'}
      </Button>
    </>
  )
}

function spotifyLogin() {
  axios
    .get('/api/auth/url')
    .then((res) => {
      window.location = res.data.url
    })
    .catch((err) => {
      console.log(err)
    })
}

function logout() {
  sessionStorage.removeItem('token')
  // Redirect to home
  window.location.href = '/'
}

export default LoginButton
