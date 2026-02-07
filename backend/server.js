import express from "express";
import cors from "cors"
import "dotenv/config"
import songRouter from "./src/routes/songRoute.js";
import connectDB from "./src/config/mongodb.js";
import userRouter from "./src/routes/userRoute.js";
import messageRouter from "./src/routes/messageRoute.js";
import connectCloudinary from "./src/config/cloudinary.js";
import albumRouter from "./src/routes/albumRoute.js";
import playlistRouter from "./src/routes/playlistRoute.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";

//app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//Create HTTP server
const httpServer = createServer(app);

//Initialize socket.io server
export const io = new Server(httpServer, {
  cors: {origin: "*"}
})

//Store online users
export const userSocketMap = {}; //{ userId: socketId  }

//Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected", userId);

  if(userId) userSocketMap[userId] = socket.id;

  //Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // user currently playing a song
  socket.on("updateNowPlaying", (data) => {
    const { songName, songId, userId, isPlaying } = data;

    // Only broadcast if user is actually playing
    if (isPlaying) {
      io.emit("userNowPlaying", {
        userId,
        songName,
        songId,
        isPlaying
      });
    } else {
      // If user paused, remove their now playing status
      io.emit("userStoppedPlaying", { userId });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", userId);
    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    io.emit("userStoppedPlaying", { userId });
  })
})

//middlewares
app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: 'https://vybe-bice.vercel.app',
  credentials: true
}))

//initializing routes
app.use("/api/song", songRouter)
app.use("/api/album", albumRouter)
app.use("/api/user", userRouter)
app.use("/api/message", messageRouter)
app.use("/api/playlist", playlistRouter);
app.get('/', (req, res) => res.send("API Working"));


httpServer.listen(port, () => console.log(`Server started on ${port}`));
