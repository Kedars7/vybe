import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { useEffect } from "react";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const url = import.meta.env.VITE_BACKEND_URL;

    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const [authUser, setAuthUser] = useState(null);

    //Check if the user is authenticated and if so, set user data and connect to socket
    const checkAuth = async () => {
        try{
            const response = await axios.get(`${url}/api/user/getUser`, { withCredentials: true });
            if(response.data.success){
                setAuthUser(response.data.user);
                connectSocket(response.data.user);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return;

        const newSocket = io(url, {
            query: {
                userId: userData._id,
            }
        });

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });

        setSocket(newSocket);
    }

    useEffect(() => {
        checkAuth();
    }, [])

    const value = {
        authUser,
        onlineUsers,
        socket
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}