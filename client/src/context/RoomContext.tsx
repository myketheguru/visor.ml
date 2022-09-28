import {
    createContext,
    useEffect,
    useState,
    useReducer,
    useContext,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { ws } from "../ws";
import { peersReducer, PeerState } from "../reducers/peerReducer";
import { ImeetingState, meetingReducer } from "../reducers/meetingReducer";
import {
    addPeerStreamAction,
    addPeerNameAction,
    removePeerStreamAction,
    addAllPeersAction,
} from "../reducers/peerActions";

import { changeRoomMode, toggleVideoStream, toggleAudioStream } from "../reducers/meetingActions";

import { UserContext } from "./UserContext";
import { IPeer } from "../types/peer";

interface RoomValue {
    stream?: MediaStream;
    screenStream?: MediaStream;
    peers: PeerState;
    shareScreen: () => void;
    meetId: string;
    setMeetId: (id: string) => void;
    screenSharingId: string;
    roomMode?: 'waiting' | 'started' | 'ended'
    showVideo?: boolean
    playAudio?: boolean
    participants: IPeer[]
    meetingDispatch: (val: any) => void
    stopVideo: () => void
    stopAudio: () => void
}

export const RoomContext = createContext<RoomValue>({
    peers: {},
    shareScreen: () => {},
    setMeetId: (id) => {},
    screenSharingId: "",
    meetId: "",
    participants: [],
    meetingDispatch: (val) => {},
    stopVideo: () => {},
    stopAudio: () => {},
});

export const RoomProvider: React.FunctionComponent = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userName, userId } = useContext(UserContext);
    const [me, setMe] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const [screenStream, setScreenStream] = useState<MediaStream>();
    const [peers, dispatch] = useReducer(peersReducer, {});
    const [participants, setParticipants] = useState<IPeer[]>([])
    const [meetState, meetingDispatch] = useReducer(meetingReducer, { roomMode: 'waiting', playAudio: true, showVideo: true });
    const [screenSharingId, setScreenSharingId] = useState<string>("");
    const [meetId, setMeetId] = useState<string>("");
    const [isHome, setIsHome] = useState(false)

    const enterRoom = ({ meetId }: { meetId: string }) => {
        navigate(`/meet/${meetId}`);
    };

    const getUsers = ({
        participants,
    }: {
        participants: Record<string, IPeer>;
    }) => {
        setParticipants(Object.values(participants))
        dispatch(addAllPeersAction(participants));
    };

    const removePeer = (peerId: string) => {
        dispatch(removePeerStreamAction(peerId));
    };

    const switchStream = (stream: MediaStream) => {
        setScreenSharingId(me?.id || "");
        Object.values(me?.connections).forEach((connection: any) => {
            const videoTrack: any = stream
                ?.getTracks()
                .find((track) => track.kind === "video");
            connection[0].peerConnection
                .getSenders()
                .find((sender: any) => sender.track.kind === "video")
                .replaceTrack(videoTrack)
                .catch((err: any) => console.error(err));
        });
    };

    const shareScreen = () => {
        if (screenSharingId) {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then(switchStream);
        } else {
            navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
                switchStream(stream);
                setScreenStream(stream);
            });
        }
    };

    const nameChangedHandler = ({
        peerId,
        userName,
    }: {
        peerId: string;
        userName: string;
    }) => {
        dispatch(addPeerNameAction(peerId, userName));
    };

    useEffect(() => {
        if (location.pathname === '/') {
            setIsHome(true)
        } else {
            setIsHome(false)
        }
        
        meetingDispatch(changeRoomMode('waiting'))
      }, [location]);

    useEffect(() => {
        ws.emit("change-name", { peerId: userId, userName, meetId });
    }, [userName, userId, meetId]);

    const startStream = (videoShown?: boolean, audioAvailable?: boolean) => {
        navigator.mediaDevices.getUserMedia({ video: videoShown, audio: audioAvailable }).then(mStream => {
            setStream(mStream);
        })
    }

    const stopAudio = () => {
        stream?.getAudioTracks().forEach(track => track.stop())
    }

    const stopVideo = () => {        
        stream?.getVideoTracks().forEach(track => track.stop())
    }

    useEffect(() => {
        const peer = new Peer(userId, {
            host: "157.230.186.22",
            port: 9001,
            path: "/",
        });
        setMe(peer);

        ws.on("room-created", enterRoom);
        ws.on("get-users", getUsers);
        ws.on("user-disconnected", removePeer);
        ws.on("user-started-sharing", (peerId) => setScreenSharingId(peerId));
        ws.on("user-stopped-sharing", () => setScreenSharingId(""));
        ws.on("name-changed", nameChangedHandler);
        
        return () => {
            ws.off("room-created");
            ws.off("get-users");
            ws.off("user-disconnected");
            ws.off("user-started-sharing");
            ws.off("user-stopped-sharing");
            ws.off("user-joined");
            ws.off("name-changed");
            me?.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    useEffect(() => {
        if (location.pathname.includes('meet')) {
            try {    
                const { showVideo, playAudio } = meetState
                if (showVideo && playAudio) {
                    startStream(showVideo, playAudio)
                } else if (!playAudio && !showVideo) {
                    stopAudio()
                    stopVideo()
                    setStream(undefined)
                } else if (!playAudio) {
                    stopAudio()
                    startStream(showVideo, playAudio)
                } else if (!showVideo) {
                    stopVideo()
                    startStream(showVideo, playAudio)
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            stopAudio()
            stopVideo()
            setStream(undefined)
        }
    }, [location, meetState.showVideo, meetState.playAudio])

    useEffect(() => {
        if (screenSharingId) {
            ws.emit("start-sharing", { peerId: screenSharingId, meetId });
        } else {
            ws.emit("stop-sharing");
        }
    }, [screenSharingId, meetId]);

    useEffect(() => {
        if (!me) return;
        if (!stream) return;
        ws.on("user-joined", ({ peerId, userName: name }) => {
            const call = me.call(peerId, stream, {
                metadata: {
                    userName,
                },
            });
            call.on("stream", (peerStream) => {
                dispatch(addPeerStreamAction(peerId, peerStream));
            });
            dispatch(addPeerNameAction(peerId, name));
        });

        me.on("call", (call) => {
            const { userName } = call.metadata;
            dispatch(addPeerNameAction(call.peer, userName));
            call.answer(stream);
            call.on("stream", (peerStream) => {
                dispatch(addPeerStreamAction(call.peer, peerStream));
            });
        });

        return () => {
            ws.off("user-joined");
        };
    }, [me, stream, userName]);

    return (
        <RoomContext.Provider
            value={{
                stream,
                screenStream,
                peers,
                shareScreen,
                meetId,
                setMeetId,
                screenSharingId,
                roomMode: meetState.roomMode,
                playAudio: meetState.playAudio,
                showVideo: meetState.showVideo,
                meetingDispatch,
                stopVideo,
                stopAudio,
                participants
            }}
        >
            {children}
        </RoomContext.Provider>
    );
};
