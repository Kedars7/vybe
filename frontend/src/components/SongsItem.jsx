import { useContext } from "react"
import { PlayerContext } from "../context/PlayerContext"

function SongsItem({ image, name, desc, id }) {
    const { playWithId } = useContext(PlayerContext);
    return (
        <div 
            key={id} 
            onClick={() => playWithId(id)} 
            className="p-2 sm:p-3 rounded cursor-pointer hover:bg-[#ffffff26] transition-all duration-200 group"
        >
            <div className="relative overflow-hidden rounded mb-2 sm:mb-3">
                <img className="w-full aspect-square object-cover rounded group-hover:scale-105 transition-transform duration-300" src={image} alt="song img" />
            </div>
            <p className="font-bold mt-1 sm:mt-2 mb-1 text-sm sm:text-base truncate">{name}</p>
            <p className="text-slate-200 text-xs sm:text-sm line-clamp-2">{desc}</p>
        </div>
    )
}

export default SongsItem