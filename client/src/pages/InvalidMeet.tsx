import { Airdrop } from 'iconsax-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const InvalidMeet = () => {
    const navigate = useNavigate()
  return (
    <div className='landing min-h-screen grid grid-rows-[auto_1fr] bg-slate-100 dark:bg-[#17181A] dark:text-gray-200 text-gray-600 p-5 px-[10%]'>
          <div className="logo flex justify-center items-center gap-2">
            <span className='text-2xl font-thin'>Visor</span>
            <Airdrop size="32" color="#ca8a04" />
          </div>
          <main className='flex flex-col items-center py-40 max-w-[600px] w-full mx-auto text-center'>
            <h1 className='text-[10vmin] leading-tight font-semibold text-[#535760]'>Invalid Meeting</h1>
            <p className='text-gray-600 text-md'>There are no available meetings with the specified ID. You can go back home and create a new meeting.</p>
            <div className="cta flex flex-col md:flex-row items-center gap-3 py-6 relative">
              <button className={`p-2 px-6 rounded-md md:rounded-full bg-gray-200 dark:bg-[#222426] font-extralight transition-all border border-yellow-600 active:scale-95  disabled:opacity-30 disabled:border-none disabled:active:scale-100 h-12 w-full hover:bg-[#363016]`} onClick={() => navigate('/')}>
                Take me home, please 🥺
              </button>
              
            </div>
    
            <footer className='text-gray-600 mt-6 font-light text-sm'>
              <p>&copy; { new Date().getFullYear() }. All rights reserved.</p>
            </footer>
          </main>
        </div>
  )
}

export default InvalidMeet