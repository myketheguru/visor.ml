import socketIOClient from "socket.io-client";

const WS = "http://161.35.120.145:8080";
export const ws = socketIOClient(WS);
