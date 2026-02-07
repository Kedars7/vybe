import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { AuthContext } from "./AuthContext";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {

    const url = import.meta.env.VITE_BACKEND_URL;

    const audioRef = useRef();
    const seekBar = useRef();
    const seekBg = useRef();

    const {socket, authUser} = useContext(AuthContext)

    const [songsData, setSongsData] = useState([]);
    const [albumsData, setAlbumsData] = useState([]);
    const [track, setTrack] = useState(null);
    const [playStatus, setPlayStatus] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [originalSongsData, setOriginalSongsData] = useState([]);
    const [isShuffle, setIsShuffle] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const [userData, setUserData] = useState(null);
    const [usersNowPlaying, setUsersNowPlaying] = useState({});
    const [likedSongs, setLikedSongs] = useState([]);
    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0
        },
        totalTime: {
            second: 0,
            minute: 0
        }
    });

    // Emit current song status
    useEffect(() => {
        if(!socket || !authUser || !track) return;

        // Emit when playing
        if(playStatus){
            socket.emit("updateNowPlaying", {
                songName: track.name,
                songId: track._id,
                isPlaying: true,
                username: authUser.username,
                userId: authUser._id
            });
        } else {
            // Emit when paused to clear status
            socket.emit("updateNowPlaying", {
                songName: track.name,
                songId: track._id,
                isPlaying: false,
                username: authUser.username,
                userId: authUser._id
            });
        }
    }, [track, playStatus, socket, authUser]);

    // Listen for other users' now playing updates
    useEffect(() => {
        if(!socket) return;

        const handleUserNowPlaying = (data) => {
            const {userId, songName, songId, isPlaying, username} = data;

            //dont show current user's now playing
            if(authUser && userId === authUser._id) return;

            setUsersNowPlaying(prev => ({
                ...prev,
                [userId]: {songName, songId, isPlaying, username}
            }));
        };

        const handleUserStoppedPlaying = (data) => {
            const {userId} = data;
            
            //dont update for current user
            if(authUser && userId === authUser._id) return;
            
            setUsersNowPlaying(prev => {
                const newState = {...prev};
                delete newState[userId];
                return newState;
            });
        };

        socket.on("userNowPlaying", handleUserNowPlaying);
        socket.on("userStoppedPlaying", handleUserStoppedPlaying);

        return () => {
            socket.off("userNowPlaying", handleUserNowPlaying);
            socket.off("userStoppedPlaying", handleUserStoppedPlaying);
        }
    }, [socket, authUser]);
    

    const handleVolumeChange = (e) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        console.log('vol', vol)
        if (audioRef.current) {
            audioRef.current.volume = vol;
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (!isMuted) {
            audioRef.current.volume = 0;
            setVolume(0);
        } else {
            audioRef.current.volume = 0.5;
            setVolume(0.5);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            audioRef.current.ontimeupdate = () => {
                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + "%";
                setTime({
                    currentTime: {
                        second: Math.floor(audioRef.current.currentTime % 60),
                        minute: Math.floor(audioRef.current.currentTime / 60)
                    },
                    totalTime: {
                        second: Math.floor(audioRef.current.duration % 60),
                        minute: Math.floor(audioRef.current.duration / 60)
                    }
                })
            }
        }, 1000)

    }, [audioRef])

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true);
    }

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    }

    const toggleLoop = () => {
        setIsLooping(!isLooping);
    };

    const toggleShuffle = () => {
        setIsShuffle(!isShuffle);
    }

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.loop = isLooping;
        }
    }, [isLooping]);

    const shuffleSongs = () => {
        const shuffledSongs = [...songsData];
        for (let i = shuffledSongs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]];
        }
        setSongsData(shuffledSongs);
    }

    useEffect(() => {
        if (isShuffle) {
            shuffleSongs();
        } else {
            setSongsData(originalSongsData);
        }
    }, [isShuffle, originalSongsData]);

    const playWithId = async (id) => {
        await songsData.map((item) => {
            if (id === item._id) {
                setTrack(item);
            }
        })
        await audioRef.current.play();
        setPlayStatus(true);
    }

    const previusSong = async () => {
        songsData.map(async (item, index) => {
            if (track._id === item._id && index > 0) {
                await setTrack(songsData[index - 1]);
                await audioRef.current.play();
                setPlayStatus(true);
            }
        })
    }

    const nextSong = async () => {
        songsData.map(async (item, index) => {
            if (track._id === item._id && index < songsData.length - 1) {
                await setTrack(songsData[index + 1]);
                await audioRef.current.play();
                setPlayStatus(true);
            }
        })
    }

    const seekSong = async (e) => {
        audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration)
    }

    const getUserData = async () => {
        try{
            const response = await axios.get(`${url}/api/user/getUser`, { withCredentials: true });
            setUserData(response.data.user);
        }
        catch(error){
            console.log('error getUserData', error);
        }
    }

    const getSongsData = async () => {
        try {
            const response = await axios.get(`${url}/api/song/list`);
            setSongsData(response.data.songs);
            setOriginalSongsData(response.data.songs);
        } catch (error) {
            console.log('error getSongsData', error);
        }
    }

    const getAlbumsData = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`);
            setAlbumsData(response.data.albums);
        } catch (error) {
            console.log('error getAlbumsData', error);
        }
    }

    const getLikedSongs = async () => {
        try {
            const response = await axios.get(`${url}/api/playlist/liked/songs`, { withCredentials: true });
            setLikedSongs(response.data.likedSongs);
        } catch (error) {
            console.log('error getLikedSongs', error);
        }
    }

    const likeSong = async (songId) => {
        try {
            const response = await axios.post(`${url}/api/playlist/like`, 
                { songId }, 
                { withCredentials: true }
            );
            if (response.data.success) {
                setLikedSongs(response.data.likedSongs);
                return { success: true };
            }
        } catch (error) {
            console.log('error likeSong', error);
            return { success: false, message: error.response?.data?.message || 'Failed to like song' };
        }
    }

    const unlikeSong = async (songId) => {
        try {
            const response = await axios.post(`${url}/api/playlist/unlike`, 
                { songId }, 
                { withCredentials: true }
            );
            if (response.data.success) {
                setLikedSongs(response.data.likedSongs);
                return { success: true };
            }
        } catch (error) {
            console.log('error unlikeSong', error);
            return { success: false, message: error.response?.data?.message || 'Failed to unlike song' };
        }
    }

    const isSongLiked = (songId) => {
        return likedSongs.some(song => song._id === songId);
    }

    useEffect(() => {
        getUserData();
        getAlbumsData();
        getSongsData();
        getLikedSongs();
    }, [])

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track, setTrack,
        playStatus, setPlayStatus,
        time, setTime,
        play, pause,
        playWithId,
        previusSong, nextSong,
        seekSong,
        songsData, albumsData,
        isLooping, toggleLoop,
        isShuffle, toggleShuffle,
        volume, handleVolumeChange,
        isMuted, toggleMute,
        userData, setUserData,
        usersNowPlaying,
        likedSongs,
        likeSong,
        unlikeSong,
        isSongLiked,
        getLikedSongs
    }

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )

}

export default PlayerContextProvider