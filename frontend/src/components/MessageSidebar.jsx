import { useNavigate } from 'react-router-dom';
import { assets } from './../assets/frontend-assets/assets';
import { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { useEffect } from 'react';

function MessageSidebar({ isSidebarOpen, setIsSidebarOpen }) {
    const navigate = useNavigate();
    const { userData } = useContext(PlayerContext);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);

    const { usersNowPlaying } = useContext(PlayerContext);

    const {getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages } = useContext(ChatContext);
    
    const {onlineUsers} = useContext(AuthContext);

    const url = import.meta.env.VITE_BACKEND_URL;
    
    const handleNavigation = (path, user) => {
        navigate(path);
        setSelectedUser(user);
        setIsSidebarOpen(false);
    };

    const handleSearchToggle = () => {
        setShowSearch(!showSearch);
        setSearchQuery('');
        setSearchResults([]);

        fetchAllUsers();
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Get friend IDs for filtering
        const friendIds = users ? users.map(friend => friend._id) : [];

        // Filter users: exclude friends, match query
        const filteredResults = searchUsers.filter(user => 
            !friendIds.includes(user._id) && 
            user.username.toLowerCase().includes(query.toLowerCase())
        );

        // Sort: users with unseen messages first
        const sortedResults = filteredResults.sort((a, b) => {
            const aHasUnseen = unseenMessages && unseenMessages[a._id] > 0;
            const bHasUnseen = unseenMessages && unseenMessages[b._id] > 0;
            
            if (aHasUnseen && !bHasUnseen) return -1;
            if (!aHasUnseen && bHasUnseen) return 1;
            return 0;
        });

        setSearchResults(sortedResults);
    };

    const fetchAllUsers = async () => {
        try{
            const response = await axios.get(`${url}/api/user/getallusers`, {
                withCredentials: true,
            });
            if(response.data.success){
                console.log(response.data.users);
                
                // Get friend IDs for filtering
                const friendIds = users ? users.map(friend => friend._id) : [];
                
                // Filter out friends from all users
                const nonFriends = response.data.users.filter(user => !friendIds.includes(user._id));
                
                // Sort: users with unseen messages first
                const sortedUsers = nonFriends.sort((a, b) => {
                    const aHasUnseen = response.data.unseenMessages && response.data.unseenMessages[a._id] > 0;
                    const bHasUnseen = response.data.unseenMessages && response.data.unseenMessages[b._id] > 0;
                    
                    if (aHasUnseen && !bHasUnseen) return -1;
                    if (!aHasUnseen && bHasUnseen) return 1;
                    return 0;
                });
                
                setSearchUsers(sortedUsers);
                setSearchResults(sortedUsers);
                return;
            }
            console.log('Failed to fetch all users for search');
            
        }
        catch(error){
            console.log('Failed to fetch all users for search, ', error);
        }
    };


    useEffect(() => {
        getUsers();
    }, [onlineUsers])
    

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
                <div className="bg-[#121212] flex-1 rounded overflow-y-auto overflow-x-hidden">
                    <div className="p-3 sm:p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img className='w-6 sm:w-8' src={assets.stack_icon} alt="stack_icon" />
                            <p className="font-semibold text-sm sm:text-base">Explore</p>
                        </div>
                        <div className='flex items-center gap-2 sm:gap-3'>
                            <img 
                                className='w-4 sm:w-5 cursor-pointer hover:scale-110 transition-transform' 
                                src={assets.plus_icon} 
                                alt="plus_icon"
                                onClick={handleSearchToggle}
                            />
                        </div>
                    </div>

                    {/* Search Input */}
                    {showSearch && (
                        <div className="px-3 sm:px-4 pb-3">
                            <input 
                                type="text" 
                                placeholder="Search users..." 
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full px-3 py-2 bg-[#282828] text-white rounded-md outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                                autoFocus
                            />
                        </div>
                    )}

                    {/* Search Results */}
                    {showSearch && searchResults.length > 0 && (
                        <div className="px-3 sm:px-4 mb-4">
                            <p className="text-xs text-gray-400 mb-2">Search Results</p>
                            {searchResults.map((user, index) => (
                                <div key={index} className="relative flex items-center gap-3 cursor-pointer hover:bg-[#282828] hover:scale-105 transition-transform delay-20 p-2 rounded" onClick={() => handleNavigation(`/message/${user._id}`, user)}>
                                <img className='w-10 h-10 rounded-full object-cover' src={user.profileImg} alt={`${user.username}_img`} />
                                {/* {
                                    onlineUsers.includes(user._id) ?
                                    <span className='text-green-400 text-xs'>Online</span> : <span className='text-red-400 text-xs'>Offline</span>
                                } */}
                                <div className="flex flex-col flex-1">
                                    <p className='text-sm sm:text-base font-semibold'>{user.username}</p>
                                    <p className='text-xs sm:text-sm text-gray-400'>{usersNowPlaying[user._id] === undefined ? 'Idle' : `🎵 ${usersNowPlaying[user._id].songName}`}</p>
                                </div>
                                {
                                    unseenMessages && unseenMessages[user._id] > 0 && <span className='absolute top-2 right-2 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-600 font-semibold z-10'>{unseenMessages[user._id]}</span>
                                }
                            </div>
                            ))}
                        </div>
                    )}

                    {showSearch && searchQuery && searchResults.length === 0 && (
                        <p className='text-center text-gray-400 mt-4 px-4'>No users found</p>
                    )}

                    {/* Friends List */}
                    {!showSearch && (
                        <>
                    {(!users || users.length === 0) && (
                        <p className='text-center text-gray-400 mt-10'>Add friends to start chatting</p>
                    )}

                    {users && users.length === 0 && (
                        <p className='text-center text-gray-400 mt-10'>Add friends to start chatting</p>
                    )}
                    <div className="flex flex-col gap-2 px-3 sm:px-4 mb-4">
                        {users && users.map((friend, index) => (
                            <div  key={index} className="relative flex items-center gap-3 cursor-pointer hover:bg-[#282828] hover:scale-105 transition-transform delay-20 p-2 rounded" onClick={() => handleNavigation(`/message/${friend._id}`, friend)}>
                                <img className={`w-10 h-10 rounded-full object-cover ${onlineUsers.includes(friend._id) ? 'border-2 border-green-400' : ''}`} src={friend.profileImg} alt={`${friend.username}_img`} />
                                <div className="flex flex-col flex-1">
                                    <p className='text-sm sm:text-base font-semibold'>{friend.username}</p>
                                    {/* Check if the friend id is present in usersnowplaying if yes then display what they are listening to */}
                                    <p className='text-xs sm:text-sm text-gray-400'>{usersNowPlaying[friend._id] === undefined ? 'Idle' : `🎵 ${usersNowPlaying[friend._id].songName}`}</p>
                                </div>
                                {
                                    unseenMessages && unseenMessages[friend._id] > 0 && <span className='absolute top-2 right-2 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-600 font-semibold z-10'>{unseenMessages[friend._id]}</span>
                                }
                            </div>
                        ))}
                    </div>
                        </>
                    )}
                    {/* Contains all the friends */}

                    </div>
                </div>
            
        </>
    )
}

export default MessageSidebar