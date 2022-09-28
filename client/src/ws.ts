import socketIOClient from "socket.io-client";

const WS = "localhost:8080";
export const ws = socketIOClient(WS);
