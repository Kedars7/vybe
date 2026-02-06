import React, { useRef } from "react";
import Navbar from "./Navbar";
import { assets } from "../assets/frontend-assets/assets";
import axios from "axios";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { useState } from "react";
import { useEffect } from "react";
import { PlayerContext } from "../context/PlayerContext";
import { useNavigate } from "react-router-dom";

const MessageArea = () => {

  // Get id from URL
  const url = import.meta.env.VITE_BACKEND_URL;
  const scrollEnd = useRef(null);
  const navigate = useNavigate();


  const { messages, selectedUser, setSelectedUser, sendMessage, getMessage, unseenMessages, setUnseenMessages  } = useContext(ChatContext);
  const { userData, usersNowPlaying, playWithId, track } = useContext(PlayerContext);

  const [input, setInput] = useState('');

  // Mark all messages from this user as seen
  const markMessagesAsSeen = async (userId) => {
    try {
      await axios.put(`${url}/api/message/markall/${userId}`, {}, {
        withCredentials: true,
      });
    } catch (error) {
      console.log('Failed to mark messages as seen:', error);
    }
  };

  const handleJoinClick = () => {
    if(usersNowPlaying[selectedUser._id]){
      const songId = usersNowPlaying[selectedUser._id].songId;
      playWithId(songId);
    }
  }

  //Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if(input.trim() === "") return null;
    await sendMessage({text: input.trim()});
    setInput('');
  }

  useEffect(() => {
    if(selectedUser){
      getMessage(selectedUser._id);
    }
  }, [])

  useEffect(() => {
    if(selectedUser){
      getMessage(selectedUser._id);
      
      // Clear unseen messages for this user in state
      setUnseenMessages((prev) => {
        const updated = { ...prev };
        delete updated[selectedUser._id];
        return updated;
      });
      
      // Mark all messages from this user as seen on backend
      markMessagesAsSeen(selectedUser._id);
    }
  }, [selectedUser])

useEffect(() => {
  if (scrollEnd.current) {
    scrollEnd.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);



  return (
    <div className="h-full bg-[#121212] flex flex-col overflow-hidden">
      <Navbar setIsSidebarOpen={window.setIsSidebarOpen} />
      
      {/* Profile Header */}
      <div className="flex items-center gap-4 p-6 pb-4 border-b border-gray-700 shrink-0">
        <img 
          src={assets.arrow_icon} 
          alt="back" 
          className="w-6 h-6 rotate-180 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        />
        <img
          className="w-16 h-16 rounded-full"
          src={selectedUser?.profileImg}
          alt="profile_picture"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">{selectedUser?.username}</h2>
          <p className="text-sm text-gray-400 mt-1">{usersNowPlaying[selectedUser?._id] === undefined ? 'Idle' : `🎵 ${usersNowPlaying[selectedUser._id].songName}`}</p>
        </div>
        {usersNowPlaying[selectedUser?._id] && usersNowPlaying[selectedUser._id].isPlaying && track?._id !== usersNowPlaying[selectedUser._id].songId && (
          <button
          onClick={handleJoinClick}
          className="border border-white hover:border-green-500 hover:scale-105 hover:text-green-500 text-white rounded-full px-6 py-3 font-semibold transition-colors">
            Join
      </button>
        )}
      </div>
    

      {/* Messages Container - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, index) => {
          const currentDate = new Date(msg.createdAt).toDateString();
          const prevMsgDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
          const showDateDivider = index === 0 || currentDate !== prevMsgDate;

          return (
            <React.Fragment key={index}>
              {/* Date Divider */}
              {showDateDivider && (
                <div className="flex justify-center my-4">
                  <span className="bg-gray-600 text-white text-xs px-3 py-1 rounded-full">
                    {new Date(msg.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}

              {/* Message */}
              <div className={`flex gap-3 ${msg.senderId !== selectedUser._id && 'flex-row-reverse'}`}>
                <img
                  className="w-10 h-10 rounded-full"
                  src={msg.senderId === selectedUser._id ? selectedUser.profileImg : userData?.profileImg}
                  alt="profile"
                />
                <div>
                  <div className={`bg-[#1f1f1f] rounded-lg p-3 max-w-md ${msg.senderId !== selectedUser._id && 'ml-auto'}`}>
                    <p className="text-white text-sm">{msg.text}</p>
                  </div>
                  <span className={`text-xs text-gray-500 mt-1 block ${msg.senderId !== selectedUser._id && 'text-right'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}

        <div ref={scrollEnd}></div>
      </div>

      {/* Message Input - Fixed at Bottom */}
      <div className="p-6 pt-4 border-t border-gray-700 bg-[#121212] shrink-0">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null}

            className="flex-1 bg-[#1f1f1f] text-white rounded-full px-6 py-3 outline-none focus:ring-1 focus:ring-gray-400 "
          />
          <button
          onClick={handleSendMessage}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-3 font-semibold transition-colors">
            Send
          </button>

        </div>
      </div>
    </div>
  );
};

export default MessageArea;
