import { useState } from 'react'
import './App.css'
import { Link, Routes, Route } from 'react-router-dom'
import Login from './users/Login'
import Register from './users/Registerv12'
import Home from './pages/Home'
import { Navigate } from 'react-router-dom'

function App() {


  return (
    <>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="*" element={<Navigate to="/error" state={{ statusCode: 404, message: "Page not found" }} replace />} />
      </Routes>
    </>
  )
}

export default App
