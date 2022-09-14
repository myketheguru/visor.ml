export const CHANGE_ROOM_MODE = "CHANGE_ROOM_MODE" as const;
export const TOGGLE_VIDEO_STREAM = "TOGGLE_VIDEO_STREAM" as const;
export const TOGGLE_AUDIO_STREAM = "TOGGLE_AUDIO_STREAM" as const;


export const changeRoomMode = (mode: 'waiting' | 'started' | 'ended') => ({
    type: CHANGE_ROOM_MODE,
    payload: { mode },
});

export const toggleVideoStream = (value: boolean) => ({
    type: TOGGLE_VIDEO_STREAM,
    payload: { value },
});

export const toggleAudioStream = (value: boolean) => ({
    type: TOGGLE_AUDIO_STREAM,
    payload: { value },
});
