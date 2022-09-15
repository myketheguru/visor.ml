import socketIOClient from "socket.io-client";

const WS = "157.230.56.200:8080";
export const ws = socketIOClient(WS);
