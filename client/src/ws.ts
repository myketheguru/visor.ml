import socketIOClient from "socket.io-client";

const WS = "http://143.198.117.135:8080";
export const ws = socketIOClient(WS);
