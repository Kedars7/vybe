import { useNavigate } from 'react-router-dom';
import { assets } from './../assets/frontend-assets/assets';

function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
    const navigate = useNavigate();
    
    const handleNavigation = (path) => {
        navigate(path);
        setIsSidebarOpen(false);
    };

    return (
        <>
            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            
            {/* Sidebar */}
            <div className={`
                fixed lg:relative 
                w-[280px] sm:w-[300px] lg:w-[25%] 
                h-full p-2 flex-col gap-2 text-white 
                bg-black lg:bg-transparent
                transition-transform duration-300 ease-in-out
                z-50 lg:z-auto
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex
            `}>
                <div className="bg-[#121212] min-h-[120px] rounded flex flex-col justify-around py-4">
                    <div onClick={() => handleNavigation("/")} className="flex items-center gap-3 pl-6 sm:pl-8 cursor-pointer hover:bg-[#ffffff26] py-2 transition-colors">
                        <img className='w-6' src={assets.home_icon} alt="home icon" />
                        <p className='font-bold'>Home</p>
                    </div>
                    <div className="flex items-center gap-3 pl-6 sm:pl-8 cursor-pointer hover:bg-[#ffffff26] py-2 transition-colors">
                        <img className='w-6' src={assets.search_icon} alt="search icon" />
                        <p className='font-bold'>Search</p>
                    </div>
                </div>
                <div className="bg-[#121212] flex-1 rounded overflow-y-auto">
                    <div className="p-3 sm:p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img className='w-6 sm:w-8' src={assets.stack_icon} alt="stack_icon" />
                            <p className="font-semibold text-sm sm:text-base">Your Library</p>
                        </div>
                        <div className='flex items-center gap-2 sm:gap-3'>
                            <img className='w-4 sm:w-5' src={assets.arrow_icon} alt="arrow_icon" />
                            <img className='w-4 sm:w-5' src={assets.plus_icon} alt="plus_icon" />
                        </div>
                    </div>
                    <div className="p-3 sm:p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-3 sm:pl-4">
                        <h1 className='text-sm sm:text-base'>Create your first playlist</h1>
                        <p className='font-light text-xs sm:text-sm'>It&apos;s easy we will help you</p>
                        <button className='px-3 sm:px-4 py-1.5 bg-white text-[13px] sm:text-[15px] text-black rounded-full mt-3 sm:mt-4 hover:scale-105 transition-transform'>Create Playlist</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar