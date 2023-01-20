import { Component } from 'solid-js'
import './Hero.css'

const Hero: Component = () => {
  return (
    <svg class='hero' viewBox='0 0 1000 120'>
      <text x='50%' y='50%' dy='.35em' text-anchor='middle'>
        #PlusXPlay
      </text>
    </svg>
  )
}

export default Hero
