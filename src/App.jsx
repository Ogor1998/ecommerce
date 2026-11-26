import { useState } from 'react'
import './App.css'
import { Link, Routes, Route } from 'react-router-dom'
import Login from './users/Login'
import Register from './users/Registerv12'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Admin from './components/admin/AdminOverview'
import { Navigate } from 'react-router-dom'
import AlertBox from './components/common/AlertBox'
import Show from './pages/Show'
import NavBar from './components/navigation/NavBar'
import Profile from './pages/Profile/Profile'
import ProfileEditComponent from './pages/Profile/ProfileEditComponent'
import ProfileDrawer from './components/common/ProfileDrawer'
import AdminDrawer from './components/admin/AdminDrawer'
import SavedAddresses from './components/address/SavedAddresses'
import AdminOverview from './components/admin/AdminOverview'

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
        <Route path='/admin' element={<Show />} />
        <Route path="/profile" element={<ProfileDrawer />}>
          <Route index element={<Profile />} />
          {/* <Route path="orders" element={<OrderHistory />} /> */}
          <Route path="addresses" element={<SavedAddresses />} />
          {/* <Route path="security" element={<SecuritySettings />} /> */}
        </Route>
        <Route path="/admin" element={<AdminDrawer />}>
          <Route index element={<AdminOverview />} />
          {/* <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:slug/edit" element={<ProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />  */}
        </Route>

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="*" element={<Navigate to="/error" state={{ statusCode: 404, message: "Page not found" }} replace />} />
      </Routes>
    </>
  )
}

export default App
