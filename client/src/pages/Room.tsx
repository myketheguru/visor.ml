import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Screenmirroring, Microphone, MicrophoneSlash, Video, VideoSlash, CallSlash, Information, Airdrop, MirroringScreen } from 'iconsax-react'
import { ShareScreenButton } from "../components/ShareScreeenButton";
import { ChatButton } from "../components/ChatButton";
import { VideoPlayer } from "../components/VideoPlayer";
import { PeerState } from "../reducers/peerReducer";
import { RoomContext } from "../context/RoomContext";
import { Chat } from "../components/chat/Chat";
import { NameInput } from "../common/Name";
import { ws } from "../ws";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";
import { changeRoomMode, toggleAudioStream, toggleVideoStream } from "../reducers/meetingActions";
import VideoCard from "../components/VideoCard";

export const Room = () => {
    const { id } = useParams();
    const { stream, screenStream, peers, shareScreen, screenSharingId, setMeetId, showVideo, playAudio, meetingDispatch } =
        useContext(RoomContext);
    const { userName, userId } = useContext(UserContext);
    const { toggleChat, chat } = useContext(ChatContext);

    const userVideo = useRef<any>()
    const [pinnedVideos, setPinnedVideos] = useState([]);

    useEffect(() => {
        if (userVideo.current) {
            userVideo.current.srcObject = stream;
        }
    }, [stream, showVideo, playAudio])
        

    useEffect(() => {
        if (stream) {
            ws.emit("join-room", { meetId: id, peerId: userId, userName });

            console.log({ meetId: id, peerId: userId, userName })
        }
    }, [id, userId, stream, userName]);

    useEffect(() => {
        setMeetId(id || "");
    }, [id, setMeetId]);

    const screenSharingVideo =
        screenSharingId === userId
            ? screenStream
            : peers[screenSharingId]?.stream;

    const { [screenSharingId]: sharing, ...peersToShow } = peers;

    const shuffleGrid = (num: number): string => {
        if (num === 1) return `grid-cols-1`
        if (num >= 2) return `md:items-center grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1`
        if (num === 3) return `grid-cols-1`
        
        return `grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]`
    } 


    return (
        <div className="meeting min-h-screen bg-slate-100 dark:bg-[#17181A] dark:text-gray-200 text-gray-600 grid grid-rows-[1fr_auto] overflow-hidden">
            <main className='grid grid-cols-[1fr_auto]'>
                <div className={`meet-grid-wrapper pt-5 px-[8%] grid ${shuffleGrid(Object.values(peersToShow).length)} gap-4`}>
                    <VideoCard videoRef={userVideo} />
                    {/* <VideoCard stream={screenSharingVideo} /> */}
                    {/* <VideoCard stream={screenSharingVideo} /> */}
                    {/* <VideoCard stream={screenSharingVideo} />
                    <VideoCard stream={screenSharingVideo} /> */}
                    {/* {Object.values(peersToShow as PeerState)
                        .filter((peer) => !!peer.stream)
                        .map((peer, index) => (
                            <VideoCard stream={peer.stream} key={peer.peerId} />  
                        ))} */}
                </div>
                <aside></aside>
            </main>
            {/* <div className="flex grow">
                {screenSharingVideo && (
                    <div className="w-4/5 pr-4">
                        <VideoPlayer stream={screenSharingVideo} />
                    </div>
                )}
                <div
                    className={`grid gap-4 ${
                        screenSharingVideo ? "w-1/5 grid-col-1" : "grid-cols-4"
                    }`}
                >
                    {screenSharingId !== userId && (
                        <div>
                            <VideoPlayer stream={stream} />
                            <NameInput />
                        </div>
                    )}

                    {Object.values(peersToShow as PeerState)
                        .filter((peer) => !!peer.stream)
                        .map((peer, index) => (
                            <div key={peer.peerId}>
                                <VideoPlayer stream={peer.stream} />
                                <div>{peer.userName}</div>
                            </div>
                        ))}
                </div>
                {chat.isChatOpen && (
                    <div className="border-l-2 pb-28">
                        <Chat />
                    </div>
                )}
            </div> */}
            <footer className='h-[75px] sticky bottom-0 w-full flex items-center justify-between p-2 px-[8%]'>
                <div className="copy flex gap-2 font-extralight">
                    <p className='hidden md:block'>Powered by</p>
                    <div id="logo" className='flex items-center'>
                        <Airdrop size={18} color='#fcc400' className='relative -rotate-12 -left-1 shm' />
                        <span className='font-normal text-sm'>Visor</span>
                    </div>
                </div>

                <div className="controls flex gap-3">
                    <button id='mic' className='bg-[#2e3033] relative group p-3 rounded-full transition-all active:scale-95 w-12 h-12 flex justify-center items-center' onClick={() => meetingDispatch(toggleAudioStream(!playAudio))}>
                                {playAudio && <Microphone size={26} />}
                                {!playAudio && <MicrophoneSlash size={26} />}

                        <span className='absolute whitespace-nowrap bg-[#292a2c] p-1 px-3 font-light rounded-full text-xs border border-[#36383a] left-1/2 -translate-x-1/2 transition-all opacity-0 group-hover:translate-y-[-250%] group-hover:opacity-100'>
                            { playAudio ? 'Mute Mic' : 'Unmute Mic' }
                        </span>
                    </button>
                    <button id='video' className='bg-[#2e3033] relative group p-3 rounded-full transition-all active:scale-95 w-12 h-12 flex items-center justify-center' onClick={() => meetingDispatch(toggleVideoStream(!showVideo))}>
                                {showVideo && <Video size={20} />}
                                {!showVideo && <VideoSlash size={20} />}

                        <span className='absolute whitespace-nowrap bg-[#292a2c] p-1 px-3 font-light rounded-full text-xs border border-[#36383a] left-1/2 -translate-x-1/2 transition-all opacity-0 group-hover:translate-y-[-250%] group-hover:opacity-100'>
                            { showVideo ? 'Hide video' : 'Show video' }
                        </span>
                    </button>
                    <button id='share-screen' className='bg-[#2e3033] relative group p-3 rounded-full transition-all active:scale-95 w-12 h-12 flex justify-center items-center' onClick={shareScreen}>
                        <MirroringScreen size={20} />

                        <span className='absolute whitespace-nowrap bg-[#292a2c] p-1 px-3 font-light rounded-full text-xs border border-[#36383a] left-1/2 -translate-x-1/2 transition-all opacity-0 group-hover:translate-y-[-250%] group-hover:opacity-100'>
                            Share Screen
                        </span>
                    </button>
                    {/* <button id='share-screen' className='bg-[#2e3033] relative group p-3 rounded-full transition-all active:scale-95 w-12 h-12 flex justify-center items-center'>
                        <RiLayoutMasonryFill size={18} />
                    </button> */}
                    <button id='share-screen' className='bg-red-600 relative group p-3 rounded-full transition-all active:scale-95 w-12 h-12 flex justify-center items-center' onClick={() => meetingDispatch(changeRoomMode('ended'))}>
                        <CallSlash size={18} />

                        <span className='absolute whitespace-nowrap bg-[#292a2c] p-1 px-3 font-light rounded-full text-xs border border-[#36383a] left-1/2 -translate-x-1/2 transition-all opacity-0 group-hover:translate-y-[-250%] group-hover:opacity-100'>
                            Leave Meeting
                        </span>
                    </button>
                </div>

                <div className="misc flex items-center gap-2">
                    <div className="rec flex gap-2 border rounded-full items-center p-1 px-3 text-[#6e7178] border-[#6e7178] fixed top-5 md:top-0 right-5 text-sm group md:relative">
                        <div className="indicator w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span>Rec</span>

                        <span className='absolute whitespace-nowrap bg-[#292a2c] p-1 px-3 font-light rounded-full text-xs border border-[#36383a] left-1/2 -translate-x-1/2 transition-all opacity-0 group-hover:translate-y-[-180%] group-hover:opacity-100 text-gray-200'>
                            This meeting is being recorded
                        </span>
                    </div>

                    <button id='info' className='bg-[#2e3033] relative group p-2 rounded-full transition-all active:scale-95 w-18 h-18 flex justify-center items-center'>
                        <Information size={16} />

                        <span className='absolute whitespace-nowrap bg-[#292a2c] p-1 px-3 font-light rounded-full text-xs border border-[#36383a] left-1/2 -translate-x-1/2 transition-all opacity-0 group-hover:translate-y-[-250%] group-hover:opacity-100'>
                            Meeting Details
                        </span>
                    </button>
                </div>
            </footer>
            {/* <div className="h-28 fixed bottom-0 p-6 w-full flex items-center justify-center border-t-2 bg-white">
                <ShareScreenButton onClick={shareScreen} />
                <ChatButton onClick={toggleChat} />
            </div> */}
        </div>
    );
};
