import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignupPage from '../Pages/SignupPage'
import App from '../App'
import LoginPage from '../Pages/LoginPage'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Routing = () => {
  return (
    <>
        <ToastContainer />
        <Routes>
            <Route path="/signup" element={<SignupPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/*" element={<App/>}/>
        </Routes>
    </>
  )
}

export default Routing