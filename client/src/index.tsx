import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RoomProvider } from "./context/RoomContext";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";
import { UserProvider } from "./context/UserContext";
import { ChatProvider } from "./context/ChatContext";
import RoomWrapper from "./pages/RoomWrapper";
import InvalidMeet from "./pages/InvalidMeet";
import NotFound from "./pages/NotFound";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <UserProvider>
                <RoomProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/invalid-meeting" element={<InvalidMeet />} />
                        <Route
                            path="/meet/:id"
                            element={
                                <ChatProvider>
                                    <RoomWrapper />
                                </ChatProvider>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </RoomProvider>
            </UserProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
