import { Route, Routes } from 'solid-app-router'
import type { Component } from 'solid-js'
import Home from './pages/Home/Home'
import Info from './pages/Info/Info'
import Submit from './pages/Submit/Submit'

const App: Component = () => {
  return (
    <div class='bggradient min-h-[100vh]'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/submit' element={<Submit />} />
        <Route path='/info' element={<Info />} />
      </Routes>
    </div>
  )
}

export default App
