import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/frontend-assets/assets'
import { useContext, useState, useRef, useEffect } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Navbar({ setIsSidebarOpen }) {
    const navigate = useNavigate();
    const { userData } = useContext(PlayerContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const url = import.meta.env.VITE_BACKEND_URL;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            const response = await axios.post(`${url}/api/user/logout`, {}, {
                withCredentials: true
            });

            if (response.data.success) {
                toast.success('Logged out successfully');
                navigate('/login');
            } else {
                toast.error('Logout failed');
            }
        } catch (error) {
            console.log('Logout error:', error);
            toast.error('Logout failed');
        }
    };


    return (
        <>
            <div className="w-full flex justify-between items-center font-semibold">
            {/* Logo of app */}
                <div className='flex gap-7'>
                    <img 
                    src={assets.vybe_logo} 
                    alt="Vybe Logo" 
                    className="h-8 sm:h-10 md:h-8 w-auto cursor-pointer hover:scale-105 transition-transform duration-200 drop-shadow-lg"
                />
                <div className="flex items-center gap-2">
                    {/* Hamburger Menu for Mobile */}
                    <button 
                        onClick={() => setIsSidebarOpen && setIsSidebarOpen(true)} 
                        className="lg:hidden p-2 hover:bg-[#ffffff26] rounded-lg transition-colors"
                        aria-label="Open menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    
                </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 relative">
                    {/* Display only if userdata is not available */}
                    {!userData && (<>
                    <p className='text-gray-300 hover:text-gray-200 text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer' onClick={() => navigate('/signup')}>Sign up</p>
                    <p className='bg-white hover:bg-gray-200 text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer' onClick={() => navigate('/login')}>Log in</p>
                    </>)}
                    {userData && (
                        <div className="relative" ref={dropdownRef}>
                            <img 
                                src={userData?.profileImg} 
                                alt="" 
                                className='w-10 h-10 sm:w-10 sm:h-10 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform' 
                                onClick={() => setShowDropdown(!showDropdown)}
                            />
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-[#282828] rounded-lg shadow-lg py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-600">
                                        <p className="text-white font-semibold text-sm">{userData.username}</p>
                                        <p className="text-gray-400 text-xs truncate">{userData.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-white hover:bg-[#3e3e3e] transition-colors text-sm"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
                <p className='bg-white text-black px-3 sm:px-4 py-1 rounded-2xl cursor-pointer text-sm sm:text-base whitespace-nowrap hover:scale-105 transition-transform'>All</p>
                <p className='bg-black text-white px-3 sm:px-4 py-1 rounded-2xl cursor-pointer text-sm sm:text-base whitespace-nowrap hover:scale-105 transition-transform'>Music</p>
                <p className='bg-black text-white px-3 sm:px-4 py-1 rounded-2xl cursor-pointer text-sm sm:text-base whitespace-nowrap hover:scale-105 transition-transform'>Podcasts</p>
            </div> */}
        </>
    )
}

export default Navbar