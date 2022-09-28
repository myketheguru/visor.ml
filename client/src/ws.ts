import socketIOClient from "socket.io-client";

const WS = "bknd.visor.ml";
export const ws = socketIOClient(WS, { secure: false });
