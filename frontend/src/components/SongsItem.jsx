import { useContext } from "react"
import { PlayerContext } from "../context/PlayerContext"

function SongsItem({ image, name, desc, id }) {
    const { playWithId, likeSong, unlikeSong, isSongLiked } = useContext(PlayerContext);
    const isLiked = isSongLiked(id);

    const handleLikeClick = async (e) => {
        e.stopPropagation();
        if (isLiked) {
            await unlikeSong(id);
        } else {
            await likeSong(id);
        }
    };

    return (
        <div 
            key={id} 
            onClick={() => playWithId(id)} 
            className="p-2 sm:p-3 rounded cursor-pointer hover:bg-[#ffffff26] transition-all duration-200 group relative"
        >
            <div className="relative overflow-hidden rounded mb-2 sm:mb-3">
                <img className="w-full aspect-square object-cover rounded group-hover:scale-105 transition-transform duration-300" src={image} alt="song img" />
                <button
                    onClick={handleLikeClick}
                    className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
                    title={isLiked ? "Unlike" : "Like"}
                >
                    <span className={`text-lg ${isLiked ? 'text-green-500' : 'text-white'}`}>
                        {isLiked ? '❤️' : '🤍'}
                    </span>
                </button>
            </div>
            <p className="font-bold mt-1 sm:mt-2 mb-1 text-sm sm:text-base truncate">{name}</p>
            <p className="text-slate-200 text-xs sm:text-sm line-clamp-2">{desc}</p>
        </div>
    )
}

export default SongsItem