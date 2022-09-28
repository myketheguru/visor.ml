import socketIOClient from "socket.io-client";

const WS = "127.0.0.1:8080";
export const ws = socketIOClient(WS, { secure: false });
