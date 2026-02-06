import { useNavigate } from 'react-router-dom';
import { assets } from './../assets/frontend-assets/assets';
import { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
    const navigate = useNavigate();
    const { songsData, playWithId, likedSongs } = useContext(PlayerContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    
    const handleNavigation = (path) => {
        navigate(path);
        setIsSidebarOpen(false);
    };

    const handleSearchClick = () => {
        setIsSearchActive(!isSearchActive);
        if (isSearchActive) {
            setSearchQuery('');
        }
    };

    const filteredSongs = songsData.filter(song => 
        song.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            
            {/* Sidebar */}
            <div className={`
                fixed lg:relative 
                w-[280px] sm:w-[300px] lg:w-[25%] 
                h-full p-2 flex-col gap-2 text-white 
                bg-black lg:bg-transparent
                transition-transform duration-300 ease-in-out
                z-50 lg:z-auto
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex
            `}>
                <div className="bg-[#121212] min-h-[120px] rounded flex flex-col justify-around py-4">
                    <div onClick={() => handleNavigation("/")} className="flex items-center gap-3 pl-6 sm:pl-8 cursor-pointer hover:bg-[#ffffff26] py-2 transition-colors">
                        <img className='w-6' src={assets.home_icon} alt="home icon" />
                        <p className='font-bold'>Home</p>
                    </div>
                    <div onClick={handleSearchClick} className="flex items-center gap-3 pl-6 sm:pl-8 cursor-pointer hover:bg-[#ffffff26] py-2 transition-colors">
                        <img className='w-6' src={assets.search_icon} alt="search icon" />
                        <p className='font-bold'>Search</p>
                    </div>
                </div>
                <div className="bg-[#121212] flex-1 rounded overflow-y-auto">
                    {isSearchActive ? (
                        <div className="p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-lg">Search Songs</h2>
                                <button 
                                    onClick={handleSearchClick}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for songs..."
                                className="w-full px-4 py-2 bg-[#242424] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                                autoFocus
                            />
                            <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
                                {searchQuery && (
                                    <p className="text-xs text-gray-400 mb-2">
                                        {filteredSongs.length} {filteredSongs.length === 1 ? 'song' : 'songs'} found
                                    </p>
                                )}
                                {searchQuery && filteredSongs.length > 0 ? (
                                    <div className="space-y-2">
                                        {filteredSongs.map((song) => (
                                            <div
                                                key={song._id}
                                                onClick={() => {
                                                    playWithId(song._id);
                                                    setIsSidebarOpen(false);
                                                }}
                                                className="flex items-center gap-3 p-2 rounded hover:bg-[#ffffff26] cursor-pointer transition-colors group"
                                            >
                                                <img
                                                    src={song.image}
                                                    alt={song.name}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm truncate">{song.name}</p>
                                                    <p className="text-xs text-gray-400 truncate">{song.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : searchQuery ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <p>No songs found</p>
                                        <p className="text-xs mt-2">Try a different search term</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        <p>Start typing to search for songs</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="p-3 sm:p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img className='w-6 sm:w-8' src={assets.stack_icon} alt="stack_icon" />
                                    <p className="font-semibold text-sm sm:text-base">Your Library</p>
                                </div>
                            </div>
                            
                            <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
                                {/* Liked Songs */}
                                {likedSongs && likedSongs.length > 0 ? (
                                    <div 
                                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#ffffff26] transition-colors"
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-700 to-blue-300 rounded flex items-center justify-center">
                                            <span className="text-2xl">❤️</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm">Liked Songs</p>
                                            <p className="text-xs text-gray-400">{likedSongs.length} songs</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 sm:p-4 bg-[#242424] m-2 rounded flex flex-col items-start justify-start gap-1 pl-3 sm:pl-4">
                                        <h1 className='text-sm sm:text-base'>No liked songs yet</h1>
                                        <p className='font-light text-xs sm:text-sm'>Songs you like will appear here</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default Sidebar