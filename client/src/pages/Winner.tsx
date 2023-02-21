import { Component, onMount, Show } from 'solid-js'
import ConfettiGenerator from 'confetti-js'
import backArrow from '../assets/back_button.svg'
import Socials from '../components/Socials'
import { currentWinner } from '../utils/winner'

const Winner: Component = () => {
  onMount(() => {
    window.addEventListener('resize', function() {
      // Update the height of the box element to the new window height
      const main = document.getElementById('main')

      if (main != null) {
        main.style.height = window.innerHeight + 'px'
      }
    })

    if (currentWinner() != null) {
      let confettiElement = document.getElementById('confettiCanvas')
      let confettiSettings = { target: confettiElement }
      let confetti = new ConfettiGenerator(confettiSettings)
      confetti.render()
    }

  })

  return (
    <div
      class='flex justify-center items-center'
      id='main'
      style={{ height: window.innerHeight + 'px' }}
    >
      <div class='flex flex-col bg-white rounded-xl justify-center items-center min-h-[85vh] w-[90vw] p-8 relative'>
        <span class='absolute top-4 right-4'>
          <Socials />
        </span>
        <a href='/'>
          <img
            src={backArrow}
            alt='backArrow'
            class='absolute top-4 left-4 h-[4vh] lg:h-[5vh] z-10'
          />
        </a>
        <Show when={currentWinner() != null}
          fallback={<p class="text-3xl russo">No winner selected yet.</p>}
        >
          <p class="russo text-2xl">This week's winner is {currentWinner().User.DisplayName}</p>
        </Show>
      </div>
      <canvas id='confettiCanvas' class='absolute top-0 left-0' />
    </div>
  )
}

export default Winner
