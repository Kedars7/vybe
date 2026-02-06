import { useContext } from "react"
import AlbumItem from "./AlbumItem"
import Navbar from "./Navbar"
import SongsItem from "./SongsItem"
import { PlayerContext } from './../context/PlayerContext';

function DisplayHome({ setIsSidebarOpen }) {
    const { songsData, albumsData } = useContext(PlayerContext)
    return (
        <>
            <Navbar setIsSidebarOpen={setIsSidebarOpen} />
            <div className="mb-6 sm:mb-8">
                <h1 className="my-4 sm:my-5 font-bold text-xl sm:text-2xl">Featured Charts</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                    {albumsData.map((item, index) => (<AlbumItem key={index} image={item.image} name={item.name} desc={item.desc} id={item._id} />))}
                </div>
            </div>
            <div className="mb-6 sm:mb-8">
                <h1 className="my-4 sm:my-5 font-bold text-xl sm:text-2xl">Today&apos;s biggest hits</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                    {songsData.map((item, index) => (<SongsItem key={index} image={item.image} name={item.name} desc={item.desc} id={item._id} />))}
                </div>
            </div>
        </>
    )
}

export default DisplayHome