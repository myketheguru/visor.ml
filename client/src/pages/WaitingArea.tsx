/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useRef, useState } from 'react'
import { Airdrop, Microphone, MicrophoneSlash, Video, VideoSlash } from 'iconsax-react'
import { RoomContext } from '../context/RoomContext';
import { toggleAudioStream, toggleVideoStream, changeRoomMode } from '../reducers/meetingActions';
import { ws } from '../ws';
import { useNavigate, useParams } from 'react-router-dom';

const WaitingArea = () => {
    const userVideo = useRef<any>()
    const navigate = useNavigate()
    const params = useParams()
    const { stream, playAudio, showVideo, meetingDispatch } =
        useContext(RoomContext);

    const checkMeetValidity = (value: string) => {
        ws.emit('check-meet-validity', { linkValue: value })
    }

    useEffect(() => {
        checkMeetValidity(params?.id as string)
      }, [])

    useEffect(() => {
        ws.on("is-valid", ({ success }) => {
            if (!success)
                navigate('/invalid-meeting')
        })

        return () => {
            ws.off("is-valid")
        }
      }, [])

    useEffect(() => {
        if (userVideo.current) {
            userVideo.current.srcObject = stream;
        }
    }, [stream, showVideo, playAudio])
        

  return (
    <div className="waiting-area min-h-screen bg-[#17181A] text-gray-200 flex flex-col">
        <div className="logo flex justify-center items-center gap-2 p-5">
            <span className='text-2xl font-thin'>Visor</span>
            <Airdrop size="32" color="#ca8a04"/>
        </div>
        <div className="flex flex-col md:flex-row flex-1 mt-20 px-[5%] md:px-[7%] lg:px-[10%] gap-5">
            <div className="display-user-media bg-[#2f3034] flex-1 h-[500px] md:h-[400px] rounded-xl flex justify-center overflow-hidden relative">
                <video autoPlay muted ref={userVideo} className={`h-[440px] scale-x-[-1] w-auto object-cover ${stream?.getVideoTracks().length ? '' : 'hidden'}`} playsInline></video>
                <h1 className={`${stream?.getTracks().length === 0 ? 'm-auto font-light text-2xl' : 'hidden'}`}>Camera is starting</h1>
                <h1 className={`${stream?.getVideoTracks().length === 0 ? 'm-auto font-light text-2xl' : 'hidden'}`}>Camera is off</h1>
                <div className="overlay absolute w-full h-full top-0 left-0">
                    <div className="controls flex gap-4 absolute bottom-3 left-1/2 -translate-x-1/2 text-white">
                        <button className={`${!playAudio ? 'bg-red-600 border-none' : 'border hover:bg-[#fff8]'} w-14 h-14 rounded-full flex justify-center items-center`} onClick={() => meetingDispatch(toggleAudioStream(!playAudio))}>
                            {playAudio && <Microphone size={20} />}
                            {!playAudio && <MicrophoneSlash size={20} />}
                        </button>
                        <button className={`${!showVideo ? 'bg-red-600 border-none' : 'border  hover:bg-[#fff8]'} w-14 h-14 rounded-full flex justify-center items-center`} onClick={() => meetingDispatch(toggleVideoStream(!showVideo))}>
                            {showVideo && <Video size={20} />}
                            {!showVideo && <VideoSlash size={20} />}
                        </button>
                    </div>
                </div>
            </div>
            <div className="join-meet-info flex-1 h-[400px] rounded-xl p-5 flex flex-col justify-center items-center gap-3">
                <h1 className="text-3xl font-extralight">Ready for this?</h1>
                <p className='text-xs font-light text-[#7c7f87]'>No one else is here</p>
                <button className='bg-[#2f3034] border border-[#45474c] p-2 px-5 rounded-full font-light transition-all hover:border-yellow-400 active:scale-95' onClick={() => { meetingDispatch(changeRoomMode('started')) }}>Join now</button>
            </div>
        </div>
    </div>
  )
}

export default WaitingArea