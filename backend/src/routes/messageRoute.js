import express from "express";
import isAuthenticated from "../middleware/authMiddleware.js";
import { getAllFriends, getAllUsers, getMessages, markMessageAsSeen, markAllMessagesAsSeen, sendMessage} from "../controllers/messageController.js"

const messageRouter = express.Router();

messageRouter.get("/getallusers", isAuthenticated, getAllUsers);
messageRouter.get("/friends", isAuthenticated, getAllFriends);
messageRouter.put("/mark/:id", isAuthenticated, markMessageAsSeen);
messageRouter.put("/markall/:id", isAuthenticated, markAllMessagesAsSeen);
messageRouter.post("/send/:id", isAuthenticated, sendMessage);
messageRouter.get("/:id", isAuthenticated, getMessages);

export default messageRouter;