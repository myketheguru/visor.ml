import { Airdrop, Keyboard } from "iconsax-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Join } from "../components/Join";
import { RoomContext } from "../context/RoomContext";
import { toggleAudioStream, toggleVideoStream } from "../reducers/meetingActions";
import { ws } from "../ws";

export const Home = () => {
  const { stopVideo, stopAudio, stream, meetingDispatch, showVideo, playAudio } =
        useContext(RoomContext);

        const navigate = useNavigate()
        const [link, setLink] = useState('')
        const [linkValid, setLinkValid] = useState(false)

    const createRoom = () => {
        ws.emit("create-room");
    };

    const checkMeetValidity = (value: string) => {
      const linkValue = value.split('meet/').slice(-1)[0]
      setLink(linkValue)
      ws.emit('check-meet-validity', { linkValue })
    }

    const joinExistingMeeting = () => {
      navigate(`/meet/${link}`)
    }

    useEffect(() => {
      stopAudio()
      stopVideo()
      meetingDispatch(toggleVideoStream(true))
      meetingDispatch(toggleAudioStream(true))
    }, [])
    
    useEffect(() => {
      ws.on("is-valid", ({ success }) => {
        setLinkValid(success)
      })

      return () => {
        ws.off("is-valid")
    }
    }, [ws])

    return (
        <div className='landing min-h-screen grid grid-rows-[auto_1fr] bg-[#17181A] text-gray-200 p-5 px-[10%]'>
          <div className="logo flex justify-center items-center gap-2">
            <span className='text-2xl font-thin'>Visor</span>
            <Airdrop size="25" color="#ca8a04" />
          </div>
          <main className='flex flex-col items-center py-20 max-w-[600px] w-full mx-auto text-center'>
            <h1 className='text-[8vmin] leading-tight font-bold text-[#535760]'>Host meetings a wizard would envy!</h1>
            <p className='text-gray-600 text-lg'>And the best part... It's Free!</p>
            <div className="cta flex flex-col md:flex-row items-center gap-3 py-12 relative">
              <button className={`${link.trim() ? 'md:-translate-x-14 opacity-20': ''} p-2 px-6 rounded-md md:rounded-full bg-[#222426] font-extralight transition-all border border-yellow-600 active:scale-95  disabled:opacity-30 disabled:border-none disabled:active:scale-100 h-12 w-full`} onClick={createRoom} disabled={!!link.trim()}>
                New meeting
              </button>
              <div className={`${link.trim() ? 'md:-translate-x-14': ''} user-input-area flex gap-2 max-w-[340px] w-full`}>
                <div className="bg-[#242628] flex input-block relative p-2 px-3 border border-[#3f4145] md:w-[280px] rounded-md gap-4 h-12">
                  <Keyboard size="25" className='self-center' color="#ca8a04"/>
                  <input type="text" placeholder='Enter meet code or paste link' className=' w-full outline-none border-none font-light text-sm focus:border focus:border-[#ca8a04] bg-transparent autofill:!bg-transparent appearance-none' autoComplete="off" name='meet-code' onChange={evt => checkMeetValidity(evt.target.value)} value={link} />
                </div>
                <button className={`${link.trim() ? 'md:px-4': ''} disabled:text-gray-700 disabled:border disabled:border-gray-800 text-gray-700 bg-yellow-500 disabled:bg-transparent p-2 px-4 transition-all rounded-md`} disabled={!link.trim() || !linkValid} onClick={joinExistingMeeting}>Join</button>
              </div>

                {
                  (!linkValid && link.trim()) &&
                  <div className="validity-notice absolute p-1 px-4 w-lg left-[140px] bottom-3 rounded-md text-sm text-gray-600 bg-yellow-500">
                      <p>Meet code or link invalid</p>
                  </div>
                }
            </div>
    
            <footer className='text-gray-600 mt-6 font-light text-sm'>
              <p>&copy; { new Date().getFullYear() }. All rights reserved.</p>
            </footer>
          </main>
        </div>
      )
};
