import { Route, Routes } from 'solid-app-router'
import type { Component } from 'solid-js'
import Admin from './pages/Admin/Admin'
import AdminLogin from './pages/Admin/AdminLogin'
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
        <Route path='/admin' element={<Admin />} />
        <Route path='/admin/login' element={<AdminLogin />} />
      </Routes>
    </div>
  )
}

export default App
