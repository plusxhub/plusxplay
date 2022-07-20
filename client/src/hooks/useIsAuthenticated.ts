import axios from 'axios'

const useIsAuthenticated = () => {
  async function checkIsAuthenticated() {
    console.log("in da hook")
    let isAuthenticated = false
    await axios
      .get('/api/auth/is-authenticated', {
      })
      .then(({ data }) => {
        console.log(data)
        if (data.is_authenticated) {
          console.log("Are we here?")
          isAuthenticated = true
        }
      })
      .catch((err) => {
        console.log(err)
      })

    return isAuthenticated
  }
}

export default useIsAuthenticated
