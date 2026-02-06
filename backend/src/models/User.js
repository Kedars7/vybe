import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
      default: "",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: [],
      },
    ],
    currentListening: {
      type: String,
      default: "",
    },
    privacyMode: {
      type: String,
      enum: ["public", "vibe-only", "invisible"],
      default: "public",
    },
    favoriteGenres : [{
      type: String,
      enum: ["rock", "pop", "jazz", "classical", "hip-hop", "electronic", "country", "reggae", "blues", "metal"],
      default: "",
    }],
    likedSongs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "song",
      default: [],
    }]
  },
  { timestamps: true },
);

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;
