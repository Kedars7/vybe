import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { useEffect } from "react";


export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const url = import.meta.env.VITE_BACKEND_URL;

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(() => {
        const saved = localStorage.getItem('selectedUser');
        return saved ? JSON.parse(saved) : null;
    });
    const [unseenMessages, setUnseenMessages] = useState(() => {
        const saved = localStorage.getItem('unseenMessages');
        return saved ? JSON.parse(saved) : {};
    });
    const [searchResults, setSearchResults] = useState([]);

    const {socket} = useContext(AuthContext);

    // Persist selectedUser to localStorage
    useEffect(() => {
        if (selectedUser) {
            localStorage.setItem('selectedUser', JSON.stringify(selectedUser));
        } else {
            localStorage.removeItem('selectedUser');
        }
    }, [selectedUser]);

    // Persist unseenMessages to localStorage
    useEffect(() => {
        localStorage.setItem('unseenMessages', JSON.stringify(unseenMessages));
    }, [unseenMessages]);

    const getUsers = async () => {
        try{
            const {data} = await axios.get(`${url}/api/message/friends`, {
                withCredentials: true,
            });

            if(data.success){
                setUsers(data.friends);
                // Merge backend unseenMessages with current state to avoid losing real-time updates
                setUnseenMessages(prevUnseen => ({
                    ...prevUnseen,
                    ...data.unseenMessages
                }));
                setSearchResults(data.friends);
            }
        }
        catch(error){
            console.log('Failed at getUsers, ', error);
        }
    }

    //function to get messages for selected user
    const getMessage = async (userId) => {
        try{
            const {data} = await axios.get(`${url}/api/message/${userId}`, {
                withCredentials: true,
            });

            if(data.success){
                setMessages(data.messages);
            }
        }
        catch(error){
            console.log('Failed at getMessage, ', error);
        }
    }

    //function to send messsage to selected user
    const sendMessage = async (messageData) => {
        try{
            const {data} = await axios.post(`${url}/api/message/send/${selectedUser._id}`, 
                messageData,
            {
                withCredentials: true,
            });

            if(data.success){
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            }
            else{
                console.log('Failed to send message');
            }
        }
        catch(error){
            console.log('Failed at sendMessage, ', error);
        }
    }

    //function to subscribe to messages for selected user
    const subscribeToMessages = async () => {
        if(!socket) return;

        socket.on("newMessage", (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id){
                setMessages.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`${url}/api/message/mark/${newMessage._id}`);
            }
            else{
                setUnseenMessages((prevUnseenMessages) => {
                    const prev = prevUnseenMessages || {};
                    return {
                        ...prev, 
                        [newMessage.senderId]: prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1
                    };
                });
            }
        }
    )
    }

    //function to unsubscribe from messages
    const unsubscribeFromMessages = async () => {
        if(socket) socket.off("newMessage");
    }


    useEffect(() => {
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    }, [socket, selectedUser]);

    // Fetch users on initial mount
    useEffect(() => {
        getUsers();
    }, []);



    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessage,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        searchResults,
        setSearchResults
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}