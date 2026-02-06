import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import PlayerContextProvider from "./context/PlayerContext.jsx";
import Routing from "./Routing/Routing.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PlayerContextProvider>
          <ChatProvider>
            <Routing />
          </ChatProvider>
        </PlayerContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
