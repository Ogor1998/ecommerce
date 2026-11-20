import { useState } from 'react'
import './App.css'
import { Link, Routes, Route } from 'react-router-dom'
import Login from './users/Login'
import Register from './users/Registerv12'
import Home from './pages/Home'
import Shop from './pages/Shop'
import { Navigate } from 'react-router-dom'
import AlertBox from './components/common/AlertBox'
import Show from './pages/Show'
import NavBar from './components/navigation/NavBar'
// import { Box, Fab, ShoppingBagIcon } from '@mui/material'


function App() {

  return (
    <>
      <AlertBox />
      <NavBar />
      <Routes>
        <Route path='/products' element={<Home />} />
        <Route path='/products/shop' element={<Shop />} />
        <Route path='/products/:slug' element={<Show />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="*" element={<Navigate to="/error" state={{ statusCode: 404, message: "Page not found" }} replace />} />
      </Routes>
    </>
  )
}

export default App
