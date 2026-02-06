import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Register = async (req, res) => {
    try{
        const { username, email, password, profileImg, privacyMode, favoriteGenres} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const existingUserByEmail = await User.findOne({ email });
        if(existingUserByEmail){
            return res.status(400).json({ success: false, message: "Email already exists" })
        }

        const existingUserByUsername = await User.findOne({ username });
        if(existingUserByUsername){
            return res.status(400).json({ success: false, message: "Username already exists" })
        }

        //Hashing password
        const hashedPass = await bcrypt.hash(password, 10);

        const userData = {
            username,
            email,
            password: hashedPass,
            profileImg,
            privacyMode,
            favoriteGenres
        }

        const user = new User(userData);

        await user.save();

        const tokenData = {
            userId: user._id
        }

        const token = jwt.sign(
            tokenData,
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({ success: true, message: "User Registered" })
    }
    catch(error){
        console.log('Failed at Register, ', error);
        return res.status(400).json({ success: false, message: "User Registration Failed" })
    }
}

const Login = async (req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }

        const isPassVaild = await bcrypt.compare(password, user.password);
        if(!isPassVaild){
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }

        const tokenData = {
            userId: user._id
        }

        const token = jwt.sign(
            tokenData,
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            success: true,
            message: "User Logged In"
        });
    }
    catch(error){
        console.log('Failed at Login, ', error);
        return res.status(400).json({ success: false, message: "User Login Failed" })
    }
}

const GetUserById = async (req, res) => {
    try{
        //Fetch the user using the token stored in cookies
        const userId = req.userId;

        if(!userId){
            return res.status(401).json({ success: false, message: "Unauthorized: No user ID provided" });
        }
        const user = await User.findById(userId)
        .select("-password")
        .populate("friends", "username email profileImg");

        if(!user){
            return res.status(404).json({ success: false, message: "User not found" })
        }
        return res.status(200).json({ success: true, user });
    }
    catch(error){
        console.log('Failed at GetUserById, ', error);
        return res.status(400).json({ success: false, message: "Failed to fetch user" })
    }
}

const GetAllUsers = async (req, res) => {
    try{
        const userId = req.userId;

        if(!userId){
            return res.status(401).json({ success: false, message: "Unauthorized: No user ID provided" });
        }

        //fetch all the users except the logged in user and exclude invisible users
        const users = await User.find({ 
            _id: { $ne: userId },
            privacyMode: { $ne: "invisible" }
        })
        .select("-password")
        .populate("friends", "username email profileImg");

        return res.status(200).json({ success: true, users });
    }
    catch(error){
        console.log('Failed at GetAllUsers, ', error);
        return res.status(400).json({ success: false, message: "Failed to fetch users" })
    }
}

const Logout = async (req, res) => {
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        return res.status(200).json({ success: true, message: "User Logged Out" });
    }
    catch(error){
        console.log('Failed at Logout, ', error);
        return res.status(400).json({ success: false, message: "User Logout Failed" })
    }
}

const GetUser = async (req, res) => {
    try{
        //Get userid from params
        const userId = req.params.id;

        const user = await User.findById(userId)
        .select("-password")
        .populate("friends", "username email profileImg");

        if(!user){
            return res.status(404).json({ success: false, message: "User not found" })
        }

        return res.status(200).json({ success: true, user });

    }
    catch(error){
        console.log('Failed at GetUserById, ', error);
        return res.status(400).json({ success: false, message: "Failed to fetch user" })
    }
}

export { Register, Login , GetUserById, GetAllUsers, Logout, GetUser};