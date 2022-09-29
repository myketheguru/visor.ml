import socketIOClient from "socket.io-client";

const WS = "http://bknd.visor.ml";
export const ws = socketIOClient(WS, {transports: ['websocket']});
