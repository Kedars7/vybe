import Playlist from "../models/Playlist.js";
import User from "../models/User.js";

// Create a new playlist
const createPlaylist = async (req, res) => {
    try {
        const { name, description, coverImage } = req.body;
        const userId = req.userId;

        if (!name) {
            return res.status(400).json({ success: false, message: "Playlist name is required" });
        }

        const playlist = new Playlist({
            name,
            description: description || "",
            owner: userId,
            coverImage: coverImage || "",
            songs: [],
        });

        await playlist.save();

        return res.status(201).json({ 
            success: true, 
            message: "Playlist created successfully",
            playlist 
        });
    } catch (error) {
        console.log('Failed at createPlaylist, ', error);
        return res.status(500).json({ success: false, message: "Failed to create playlist" });
    }
};

// Get all playlists for the logged-in user
const getUserPlaylists = async (req, res) => {
    try {
        const userId = req.userId;

        const playlists = await Playlist.find({ owner: userId })
            .populate('songs', 'name image desc artist duration')
            .sort({ createdAt: -1 });

        return res.status(200).json({ 
            success: true, 
            playlists 
        });
    } catch (error) {
        console.log('Failed at getUserPlaylists, ', error);
        return res.status(500).json({ success: false, message: "Failed to fetch playlists" });
    }
};

// Get a single playlist by ID
const getPlaylistById = async (req, res) => {
    try {
        const { id } = req.params;

        const playlist = await Playlist.findById(id)
            .populate('songs', 'name image desc artist duration file')
            .populate('owner', 'username profileImg');

        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        return res.status(200).json({ 
            success: true, 
            playlist 
        });
    } catch (error) {
        console.log('Failed at getPlaylistById, ', error);
        return res.status(500).json({ success: false, message: "Failed to fetch playlist" });
    }
};

// Add a song to playlist
const addSongToPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.body;
        const userId = req.userId;

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        // Check if user owns the playlist
        if (playlist.owner.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You don't have permission to edit this playlist" });
        }

        // Check if song is already in playlist
        if (playlist.songs.includes(songId)) {
            return res.status(400).json({ success: false, message: "Song already in playlist" });
        }

        playlist.songs.push(songId);
        await playlist.save();

        const updatedPlaylist = await Playlist.findById(playlistId)
            .populate('songs', 'name image desc artist duration');

        return res.status(200).json({ 
            success: true, 
            message: "Song added to playlist",
            playlist: updatedPlaylist 
        });
    } catch (error) {
        console.log('Failed at addSongToPlaylist, ', error);
        return res.status(500).json({ success: false, message: "Failed to add song to playlist" });
    }
};

// Remove a song from playlist
const removeSongFromPlaylist = async (req, res) => {
    try {
        const { playlistId, songId } = req.body;
        const userId = req.userId;

        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        // Check if user owns the playlist
        if (playlist.owner.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You don't have permission to edit this playlist" });
        }

        playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
        await playlist.save();

        const updatedPlaylist = await Playlist.findById(playlistId)
            .populate('songs', 'name image desc artist duration');

        return res.status(200).json({ 
            success: true, 
            message: "Song removed from playlist",
            playlist: updatedPlaylist 
        });
    } catch (error) {
        console.log('Failed at removeSongFromPlaylist, ', error);
        return res.status(500).json({ success: false, message: "Failed to remove song from playlist" });
    }
};

// Delete a playlist
const deletePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const playlist = await Playlist.findById(id);

        if (!playlist) {
            return res.status(404).json({ success: false, message: "Playlist not found" });
        }

        // Check if user owns the playlist
        if (playlist.owner.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You don't have permission to delete this playlist" });
        }

        // Don't allow deletion of default "Liked Songs" playlist
        if (playlist.isDefault) {
            return res.status(403).json({ success: false, message: "Cannot delete default playlist" });
        }

        await Playlist.findByIdAndDelete(id);

        return res.status(200).json({ 
            success: true, 
            message: "Playlist deleted successfully" 
        });
    } catch (error) {
        console.log('Failed at deletePlaylist, ', error);
        return res.status(500).json({ success: false, message: "Failed to delete playlist" });
    }
};

// Like a song (add to liked songs)
const likeSong = async (req, res) => {
    try {
        const { songId } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if song is already liked
        if (user.likedSongs.includes(songId)) {
            return res.status(400).json({ success: false, message: "Song already liked" });
        }

        user.likedSongs.push(songId);
        await user.save();

        return res.status(200).json({ 
            success: true, 
            message: "Song liked successfully",
            likedSongs: user.likedSongs
        });
    } catch (error) {
        console.log('Failed at likeSong, ', error);
        return res.status(500).json({ success: false, message: "Failed to like song" });
    }
};

// Unlike a song (remove from liked songs)
const unlikeSong = async (req, res) => {
    try {
        const { songId } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.likedSongs = user.likedSongs.filter(id => id.toString() !== songId);
        await user.save();

        return res.status(200).json({ 
            success: true, 
            message: "Song unliked successfully",
            likedSongs: user.likedSongs
        });
    } catch (error) {
        console.log('Failed at unlikeSong, ', error);
        return res.status(500).json({ success: false, message: "Failed to unlike song" });
    }
};

// Get user's liked songs
const getLikedSongs = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId)
            .populate('likedSongs', 'name image desc artist duration file');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ 
            success: true, 
            likedSongs: user.likedSongs 
        });
    } catch (error) {
        console.log('Failed at getLikedSongs, ', error);
        return res.status(500).json({ success: false, message: "Failed to fetch liked songs" });
    }
};

export { 
    createPlaylist, 
    getUserPlaylists, 
    getPlaylistById, 
    addSongToPlaylist, 
    removeSongFromPlaylist, 
    deletePlaylist,
    likeSong,
    unlikeSong,
    getLikedSongs
};
