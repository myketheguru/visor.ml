import React, { useContext, useEffect, useRef } from 'react'
import { RoomContext } from '../context/RoomContext';

const VideoCard = (props: any) => {
    const ref = useRef<any>()
    const { showVideo } =
        useContext(RoomContext);

    useEffect(() => {
        if (props.stream) {
            ref.current.srcObject = props?.stream;
        }
    }, [props?.stream]);

  return (
    <div className="bg-[#242628] only:bg-transparent group w-full md:w-auto only:w-full only:h-full flex-1 h-[400px] rounded-lg overflow-hidden">           
        <video autoPlay muted ref={props.videoRef ?? ref} className={`h-full group-only:mx-auto rounded-lg scale-x-[-1] w-auto object-cover ${showVideo ? '' : 'hidden'}`} playsInline></video>
        {
            !showVideo ?
            <div className="user-block h-full w-auto group-only:mx-auto rounded-lg flex items-center justify-center">
                <figure className='w-24 h-24 bg-[#3d3f43] rounded-full'></figure>
            </div> :
            null
        }
    </div>
  )
}

export default VideoCard