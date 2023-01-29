import { Component, onMount } from 'solid-js'
import backArrow from '../../assets/back_button.svg'
import './Admin.css'
import Socials from '../../components/Socials'
import { isAdmin } from '../../utils/login'
import { useNavigate } from 'solid-app-router'

const Admin: Component = () => {
  onMount(() => {
    console.log(isAdmin())
    if (!isAdmin()) {
      const navigate = useNavigate()
      navigate('/')
    }
  })

  return (
    <div class='flex justify-center items-center min-h-[100vh]'>
      {/* TODO: Add the flat logo */}
      <div class='flex flex-col bg-white rounded-xl justify-center min-h-[85vh] w-[90vw] p-8 relative items-center'>
        <span class='absolute top-4 right-4'>
          <Socials />
        </span>
        <a href='/'>
          <img
            src={backArrow}
            alt='backArrow'
            class='absolute top-4 left-4 h-[4vh] lg:h-[5vh]'
          />
        </a>
        Halo
      </div>
    </div>
  )
}

export default Admin
