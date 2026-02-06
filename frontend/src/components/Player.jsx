import { useContext } from 'react';
import { assets } from './../assets/frontend-assets/assets';
import { PlayerContext } from '../context/PlayerContext';

function Player() {

    const { track, seekBar, seekBg, play, pause, playStatus, time, nextSong, previusSong,
        seekSong, toggleLoop, isLooping, isShuffle, toggleShuffle, volume, handleVolumeChange,
        isMuted, toggleMute, likeSong, unlikeSong, isSongLiked } = useContext(PlayerContext)

    const isLiked = track ? isSongLiked(track._id) : false;

    const handleLikeClick = async () => {
        if (!track) return;
        if (isLiked) {
            await unlikeSong(track._id);
        } else {
            await likeSong(track._id);
        }
    };

    return track ? (
        <div className="h-[10%] min-h-[80px] sm:min-h-[90px] bg-black flex flex-col sm:flex-row justify-between items-center text-white px-2 sm:px-4 py-2 sm:py-0 gap-2 sm:gap-0">
            {/* Track Info - Left Side */}
            <div className="hidden md:flex items-center gap-3 min-w-[180px] lg:min-w-[220px]">
                <img className="w-10 sm:w-12 h-10 sm:h-12 rounded object-cover" src={track.image} alt="song img" />
                <div className='overflow-hidden'>
                    <p className='text-xs sm:text-sm font-semibold truncate'>{track.name}</p>
                    <p className='text-[10px] sm:text-xs text-gray-400 truncate'>{track.desc.slice(0, 20)}</p>
                </div>
                <button
                    onClick={handleLikeClick}
                    className="ml-2 hover:scale-110 transition-transform"
                    title={isLiked ? "Unlike" : "Like"}
                >
                    <span className={`text-lg ${isLiked ? 'text-green-500' : 'text-gray-400 hover:text-white'}`}>
                        {isLiked ? '❤️' : '🤍'}
                    </span>
                </button>
            </div>

            {/* Player Controls - Center */}
            <div className="flex flex-col items-center gap-1 sm:gap-2 flex-1 w-full sm:w-auto">
                <div className="flex gap-3 sm:gap-4 items-center">
                    <img onClick={toggleShuffle} className={`w-3 sm:w-4 cursor-pointer hover:scale-110 transition-transform ${!isShuffle ? "opacity-40" : ""}`} src={assets.shuffle_icon} alt="shuffle_icon" />
                    <img onClick={previusSong} className='w-3 sm:w-4 cursor-pointer hover:scale-110 transition-transform' src={assets.prev_icon} alt="prev_icon" />
                    {!playStatus ? (
                        <img onClick={play} className='w-7 sm:w-8 cursor-pointer hover:scale-110 transition-transform' src={assets.play_icon} alt="play_icon" />
                    ) : (
                        <img onClick={pause} className='w-7 sm:w-8 cursor-pointer hover:scale-110 transition-transform' src={assets.pause_icon} alt="pause_icon" />
                    )}
                    <img onClick={nextSong} className='w-3 sm:w-4 cursor-pointer hover:scale-110 transition-transform' src={assets.next_icon} alt="next_icon" />
                    <img onClick={toggleLoop} className={`w-3 sm:w-4 cursor-pointer hover:scale-110 transition-transform ${!isLooping ? "opacity-40" : ""}`} src={assets.loop_icon} alt="loop_icon" />
                </div>
                <div className="flex items-center justify-center gap-2 sm:gap-5 w-full max-w-[90vw] sm:max-w-none">
                    <p className='text-[10px] sm:text-xs min-w-[35px] sm:min-w-[40px] text-center'>
                        {String(time.currentTime.minute).padStart(2, '0')}:{String(time.currentTime.second).padStart(2, '0')}
                    </p>
                    <div ref={seekBg} onClick={seekSong} className='w-full sm:w-[40vw] md:w-[50vw] lg:w-[60vw] max-w-[500px] h-1 bg-gray-600 rounded-full cursor-pointer group'>
                        <hr ref={seekBar} className='h-1 border-none w-0 bg-green-500 rounded-full group-hover:bg-green-400 transition-colors' />
                    </div>
                    <p className='text-[10px] sm:text-xs min-w-[35px] sm:min-w-[40px] text-center'>
                        {String(time.totalTime.minute).padStart(2, '0')}:{String(time.totalTime.second).padStart(2, '0')}
                    </p>
                </div>
            </div>

            {/* Volume Controls - Right Side */}
            <div className="hidden lg:flex items-center gap-2 opacity-75 hover:opacity-100 transition-opacity min-w-[180px] justify-end">
                <img className='w-3.5 hidden xl:block' src={assets.plays_icon} alt="plays_icon" />
                <img className='w-3.5 hidden xl:block' src={assets.mic_icon} alt="mic_icon" />
                <img className='w-3.5 hidden xl:block' src={assets.queue_icon} alt="queue_icon" />
                <img className='w-3.5' src={assets.speaker_icon} alt="speaker_icon" />
                <img onClick={toggleMute} className='w-3.5 cursor-pointer hover:scale-110 transition-transform' src={!isMuted && volume !== 0 ? assets.volume_icon : assets.mute_icon} alt="volume_icon" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 xl:w-20 h-1 accent-green-500 cursor-pointer"
                />
                <img className='w-3.5 hidden xl:block' src={assets.mini_player_icon} alt="mini_player_icon" />
                <img className='w-3.5 hidden xl:block' src={assets.zoom_icon} alt="zoom_icon" />
            </div>
            
            {/* Mobile Volume Control */}
            <div className="flex lg:hidden items-center gap-2 opacity-75">
                <img onClick={toggleMute} className='w-4 cursor-pointer' src={!isMuted && volume !== 0 ? assets.volume_icon : assets.mute_icon} alt="volume_icon" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 accent-green-500 cursor-pointer"
                />
            </div>
        </div>
    ) : null
}

export default Player