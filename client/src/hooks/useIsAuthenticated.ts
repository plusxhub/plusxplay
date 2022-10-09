import axios from 'axios'
import { useEffect, useState } from 'react';

const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // TODO: If not authenticated, navigate to home.
  
  useEffect(() => {
    axios
      .get('/api/auth/is-authenticated', {
      })
      .then(({ data }) => {
        if (data.is_authenticated) {
          setIsAuthenticated(true)
        }
      })
      .catch((err) => {
        console.log(err)
    })
  }, [])

  return isAuthenticated
}

export default useIsAuthenticated
