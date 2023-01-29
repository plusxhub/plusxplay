import axios from "axios"
import { Component, onMount } from "solid-js"
import API_URL from "../../utils/api"

const AdminLogin: Component = () => {
  onMount(() => {
  axios
    .get(API_URL + '/admin/url')
    .then((res) => {
      // console.log
      window.location.href = res.data.url
    })
    .catch((err) => {
      console.log(err)
    })
  })

  return (
    <div>
      Logging In
    </div>
  )
}

export default AdminLogin
