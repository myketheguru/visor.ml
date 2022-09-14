import React, { useContext } from 'react'
import { RoomContext } from '../context/RoomContext';
import MeetingEnded from './MeetingEnded';
import { Room } from './Room';
import WaitingArea from './WaitingArea';

const RoomWrapper = () => {
    const { roomMode } =
        useContext(RoomContext);
  return (
    <div className='room-wrapper'>
        { 
                roomMode === 'waiting' ? <WaitingArea /> :
                roomMode === 'started' ? <Room /> :
                <MeetingEnded />
            }   
    </div>
  )
}

export default RoomWrapper