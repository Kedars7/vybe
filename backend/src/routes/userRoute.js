import express from 'express';
import { GetAllUsers, GetUser, GetUserById, Login, Logout, Register } from '../controllers/userContoller.js';
import isAuthenticated from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);
router.get('/getUser', isAuthenticated, GetUserById);
router.get('/getallusers', isAuthenticated, GetAllUsers);
router.post('/logout', isAuthenticated, Logout);
router.get('/getuser/:id', isAuthenticated, GetUser);

export default router;