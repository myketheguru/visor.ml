import { IPeer } from "../types/peer";
import {
    CHANGE_ROOM_MODE,
    TOGGLE_AUDIO_STREAM,
    TOGGLE_VIDEO_STREAM
} from "./meetingActions";

export interface ImeetingState {
    roomMode: 'waiting' | 'started' | 'ended'
    showVideo: boolean
    playAudio: boolean
}

export type meetingAction =
    | {
          type: typeof CHANGE_ROOM_MODE;
          payload: { mode: 'waiting' | 'started' | 'ended' };
      }
    | {
          type: typeof TOGGLE_VIDEO_STREAM;
          payload: { value: boolean };
      }
    | {
          type: typeof TOGGLE_AUDIO_STREAM;
          payload: { value: boolean };
      }

export const meetingReducer = (state: ImeetingState, action: meetingAction): ImeetingState => {
    switch (action.type) {
        case CHANGE_ROOM_MODE:
            return {
                ...state,
                roomMode: action.payload.mode,
            };
        case TOGGLE_VIDEO_STREAM:
            return {
                ...state,
                showVideo: action.payload.value ?? !state.showVideo,
            };
        case TOGGLE_AUDIO_STREAM:
            return {
                ...state,
                playAudio: action.payload.value ?? !state.playAudio,
            };
       
        default:
            return { ...state };
    }
};
