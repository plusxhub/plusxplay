import { Component, onMount } from 'solid-js'
import ConfettiGenerator from 'confetti-js'
import { currentUser } from '../../utils/login'
import Socials from '../../components/Socials'
import backArrow from '../../assets/back_button.svg'

const Submitted: Component = () => {
  onMount(() => {
    let confettiElement = document.getElementById('confettiCanvas')
    let confettiSettings = { target: confettiElement }
    let confetti = new ConfettiGenerator(confettiSettings)
    confetti.render()
  })

  return (
    <div
      class='flex justify-center items-center overflow-x-hidden'
      style={{ height: window.innerHeight + 'px' }}
    >
      <div class='flex flex-col my-[7vh] md:my-0 lg:my-0 bg-white rounded-xl justify-center items-center min-h-[85vh] w-[90vw] p-4 relative'>
        <span class='absolute top-4 right-4 z-10'>
          <Socials />
        </span>
        <a href='/'>
          <img
            src={backArrow}
            alt='backArrow'
            class='absolute top-4 left-4 h-[4vh] lg:h-[5vh] z-10'
          />
        </a>
        <p
          class='text-2xl lg:text-4xl px-4'
          style={{
            'font-family': 'Russo One',
          }}
        >
          You have sucessfully submitted the playlist{' '}
          {currentUser()?.DisplayName} !
        </p>
      </div>
      <canvas id='confettiCanvas' class='absolute top-0 left-0' />
    </div>
  )
}

export default Submitted
