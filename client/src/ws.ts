import socketIOClient from "socket.io-client";

const WS = "https://visorml-server.onrender.com/";
export const ws = socketIOClient(WS);
