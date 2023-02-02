import { Route, Routes } from 'solid-app-router'
import { Component } from 'solid-js'
import Admin from './pages/Admin/Admin'
import AdminLogin from './pages/Admin/AdminLogin'
import Home from './pages/Home/Home'
import Info from './pages/Info/Info'
import Submit from './pages/Submit/Submit'
import Submitted from './pages/Submit/Submitted'

const App: Component = () => {
  return (
    <div class='bggradient'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/submit' element={<Submit />} />
          <Route path='/submitted' element={<Submitted />} />
          <Route path='/info' element={<Info />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/admin/login' element={<AdminLogin />} />
        </Routes>
    </div>
  )
}

export default App
