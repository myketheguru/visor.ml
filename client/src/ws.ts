import socketIOClient from "socket.io-client";

const WS = "157.230.186.22:8080";
export const ws = socketIOClient(WS);
