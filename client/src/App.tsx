import './App.css'

import React from 'react'
import { Route, Routes, Link } from 'react-router-dom'

// TODO: Lazy load pages
import Home from './pages/Home'
import PlaylistSubmission from './pages/PlaylistSubmission'

const App: React.FC = (): JSX.Element => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/submit' element={<PlaylistSubmission />} />
      <Route
        path='*'
        element={
          <main style={{ padding: '1rem' }}>
            <p>There's nothing here!</p>
            <Link to='/'>Home</Link>
          </main>
        }
      />
    </Routes>
  )
}

export default App
