import socketIOClient from "socket.io-client";

const WS = "https://bknd.visor.ml";
export const ws = socketIOClient(WS, {secure: true});
