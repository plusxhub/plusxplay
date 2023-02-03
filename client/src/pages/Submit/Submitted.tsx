import { Component, onMount } from 'solid-js'
import ConfettiGenerator from 'confetti-js'

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
      <div class='flex flex-col my-[7vh] md:my-0 lg:my-0 bg-white rounded-xl items-center min-h-[85vh] w-[90vw] p-4 relative'>
        Submitted! This page is a todo still :(
      </div>
      <canvas id='confettiCanvas' class='absolute top-0 left-0' />
    </div>
  )
}

export default Submitted