import { Route, Routes, useLocation } from "react-router-dom"
import DisplayHome from "./DisplayHome"
import DisplayAlbum from "./DisplayAlbum"
import MessageArea from "./MessageArea"
import { useContext, useEffect, useRef } from "react"
import { PlayerContext } from "../context/PlayerContext";
import SignupPage from "../Pages/SignupPage"

function Display() {
    const { albumsData } = useContext(PlayerContext);

    const displayRef = useRef();
    const location = useLocation();
    const isAlbum = location.pathname.includes("album");
    const albumId = isAlbum ? location.pathname.split('/').pop() : "";
    const bgColor = isAlbum && albumsData.length > 0 ? albumsData.find((album) => (album._id === albumId)).bgColour : "#121212";

    useEffect(() => {
        if (isAlbum) {
            displayRef.current.style.background = `linear-gradient(${bgColor},#121212)`;
        } else {
            displayRef.current.style.background = `#121212`;
        }
    }, [isAlbum, bgColor]);

    return (
        <div ref={displayRef} className="w-full px-3 py-3 sm:px-6 sm:pt-4 rounded bg-[#121212] text-white overflow-hidden lg:w-[75%] lg:ml-0 lg:m-2">
            {albumsData.length > 0 ?
                <Routes>
                    <Route path="/" element={<DisplayHome />} />
                    <Route path="/album/:id" element={<DisplayAlbum album={albumsData.find((album) => (album._id == albumId))} />} />
                    <Route path="/message/:id" element={<MessageArea/>} />
                </Routes>
                : null}
        </div>
    )
}

export default Display