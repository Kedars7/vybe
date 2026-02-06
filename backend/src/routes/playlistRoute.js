import express from "express";
import { 
    createPlaylist, 
    getUserPlaylists, 
    getPlaylistById, 
    addSongToPlaylist, 
    removeSongFromPlaylist, 
    deletePlaylist,
    likeSong,
    unlikeSong,
    getLikedSongs
} from "../controllers/playlistController.js";
import isAuthenticated from "../middleware/authMiddleware.js";

const playlistRouter = express.Router();

// Playlist routes
playlistRouter.post("/create", isAuthenticated, createPlaylist);
playlistRouter.get("/user", isAuthenticated, getUserPlaylists);
playlistRouter.get("/:id", isAuthenticated, getPlaylistById);
playlistRouter.post("/add-song", isAuthenticated, addSongToPlaylist);
playlistRouter.post("/remove-song", isAuthenticated, removeSongFromPlaylist);
playlistRouter.delete("/:id", isAuthenticated, deletePlaylist);

// Liked songs routes
playlistRouter.post("/like", isAuthenticated, likeSong);
playlistRouter.post("/unlike", isAuthenticated, unlikeSong);
playlistRouter.get("/liked/songs", isAuthenticated, getLikedSongs);

export default playlistRouter;
