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
// import { Box, Fab, ShoppingBagIcon } from '@mui/material'


function App() {

  const [showCart, setShowCart] = useState(false)
  const handleCartOpen = () => setShowCart(true)
  const handleCartClose = () => setShowCart(false)
  return (
    <>
      <AlertBox />
      <Routes>
        <Route path='/products' element={<Home />} />
        <Route path='/products/shop' element={<Shop showCart={showCart}
          setShowCart={setShowCart}
          handleCartClose={handleCartClose}
          handleCartOpen={handleCartOpen}
        />} />
        <Route path='/products/:slug' element={<Show showCart={showCart}
          setShowCart={setShowCart}
          handleCartClose={handleCartClose}
          handleCartOpen={handleCartOpen}
        />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="*" element={<Navigate to="/error" state={{ statusCode: 404, message: "Page not found" }} replace />} />
      </Routes>
    </>
  )
}

export default App
