import { useParams } from 'react-router-dom'
import Navbar from './Navbar'
import { assets } from '../assets/frontend-assets/assets';
import { PlayerContext } from '../context/PlayerContext';
import { useContext, useEffect, useState } from 'react';

const DisplayAlbum = ({ album }) => {

    const { id } = useParams();
    const [albumData, setAlbumData] = useState("");
    const { playWithId, albumsData, songsData, track, play, pause, playStatus } = useContext(PlayerContext);
    const [hoveredSongId, setHoveredSongId] = useState(null); // Hover state

    useEffect(() => {
        albumsData.map((item) => {
            if (item._id === id) {
                setAlbumData(item);
            }
        });
    }, [albumsData, id]);

    const handleMouseEnter = (songId) => {
        setHoveredSongId(songId);
    };

    const handleMouseLeave = () => {
        setHoveredSongId(null);
    };

    return albumData ? (
        <>
            <Navbar setIsSidebarOpen={window.setIsSidebarOpen} />
            <div className="mt-6 sm:mt-10 flex gap-4 sm:gap-8 flex-col md:flex-row md:items-end">
                <img className='w-32 sm:w-40 md:w-48 rounded shadow-xl' src={albumData.image} alt="" />
                <div className="flex flex-col gap-2 sm:gap-3">
                    <p className='text-xs sm:text-sm'>Playlist</p>
                    <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-1 sm:mb-2 break-words'>{albumData.name}</h2>
                    <h4 className='text-sm sm:text-base text-gray-300'>{albumData.desc}</h4>
                    <div className='flex flex-wrap gap-2 text-xs sm:text-sm'>
                        <div className='flex items-center'>
                            <img className='inline-block w-4 sm:w-5 mr-2' src={assets.spotify_logo} alt="spotify_logo" />
                            <b className='mr-2'>Spotify</b>
                        </div>
                        <div className='text-gray-300 flex flex-wrap gap-1'>
                            <span>• 1,323,154 likes</span>
                            <b> • 50 songs </b>
                            <span className='hidden sm:inline'>- about 2 hr. 30 min.</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[0.5fr_2fr_2fr_0.5fr] mt-6 sm:mt-10 mb-3 sm:mb-4 px-2 sm:pl-2 text-[#a7a7a7] text-xs sm:text-sm border-b border-[#ffffff26] pb-2">
                <p className='flex items-center'><span className='mr-2'>#</span><b className='hidden sm:inline'>Title</b></p>
                <p className='pl-2 sm:pl-0'>Name</p>
                <p className='hidden sm:block'>Date Added</p>
                <img className='m-auto w-3 sm:w-4' src={assets.clock_icon} alt="clock_icon" />
            </div>
            {songsData.filter((item) => item.album === album.name).map((item, index) => (
                <div
                    key={index}
                    onClick={() => hoveredSongId === item._id && playStatus ? pause() : playWithId(item._id)}
                    className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[0.5fr_2fr_2fr_0.5fr] gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff26] cursor-pointer rounded transition-colors"
                    onMouseEnter={() => handleMouseEnter(item._id)}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className='flex items-center gap-2 sm:gap-3'>
                        <div className='w-4 sm:w-6 text-center'>
                            {track._id === item._id && playStatus ?
                                <img className='w-4 sm:w-5 mx-auto' src={hoveredSongId === item._id ? assets.pause_icon : assets.music_gif} alt="playing" />
                                : hoveredSongId === item._id ? 
                                    <img className='w-3 sm:w-4 mx-auto' onClick={play} src={assets.play_icon} alt="play" />
                                    : <b className='text-xs sm:text-sm text-[#a7a7a7]'>{index + 1}</b>
                            }
                        </div>
                        <img className='w-8 sm:w-10 h-8 sm:h-10 rounded object-cover' src={item.image} alt="" />
                    </div>
                    <p className='text-xs sm:text-[15px] font-bold text-white truncate pl-2 sm:pl-0'>{item.name}</p>
                    <p className='text-xs sm:text-[15px] hidden sm:block'>5 days ago</p>
                    <p className='text-xs sm:text-[15px] text-center'>{item.duration}</p>
                </div>
            ))}
        </>
    ) : null
}

export default DisplayAlbum;
