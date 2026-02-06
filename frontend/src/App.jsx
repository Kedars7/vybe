import { useContext, useState } from 'react'
import Display from './components/Display'
import Player from './components/Player'
import Sidebar from './components/Sidebar'
import { PlayerContext } from './context/PlayerContext'
import MessageSidebar from './components/MessageSidebar'

const App = () => {

  const { audioRef, track, songsData } = useContext(PlayerContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='h-screen bg-black overflow-hidden'>
      {songsData.length !== 0 ?
        <>
          <div className="h-[90%] flex relative">
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Display setIsSidebarOpen={setIsSidebarOpen} />
            <MessageSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          </div>
          <Player />
        </>
        : null}
      <audio ref={audioRef} src={track?.file || undefined} preload='none'></audio>
    </div>
  )
}

export default App