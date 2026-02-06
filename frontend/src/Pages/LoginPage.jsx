import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/frontend-assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    //Backend signup logic here
    if(!email || !password){
      toast.error("All fields are required");
      return;
    }

    try{
      const response = await axios.post(`${backendurl}/api/user/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if(response.data.success){
        toast.success("User Logged In Successfully");
        //check if token is set in cookies
        navigate("/");
        window.location.reload();
      } else {
        toast.error(response.data.message || "User Login Failed");
      }
    }
    catch(error){
      const errorMessage = error.response?.data?.message || "User Login Failed";
      toast.error(errorMessage);
    }
  }

  const handlePhoneLogin = () => {
    console.log('Login with phone number')
  }

  const handleGoogleLogin = () => {
    console.log('Login with Google')
  }

  const handleFacebookLogin = () => {
    console.log('Login with Facebook')
  }

  const handleAppleLogin = () => {
    console.log('Login with Apple')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={assets.vybe_logo} alt="Vybe" className="h-10" />
        </div>

        {/* Heading */}
        <h1 className="text-white text-center font-bold text-4xl sm:text-5xl mb-8">
          Welcome back
        </h1>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mb-4">
          <div>
            <label className="block text-white font-semibold mb-2 text-sm">
            Email
          </label>
          <input
            type="text"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#121212] text-white border border-gray-600 rounded px-4 py-3 mb-4 focus:outline-none focus:border-white placeholder-gray-400"
            required
          />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2 text-sm">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#121212] text-white border border-gray-600 rounded px-4 py-3 mb-4 focus:outline-none focus:border-white placeholder-gray-400"
            required
          />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 mb-4"
          >
            Continue
          </button>
        </form>


        {/* Sign Up Link */}
        <div className="text-center text-gray-400 border-t border-gray-600 pt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-white underline hover:text-green-500">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage