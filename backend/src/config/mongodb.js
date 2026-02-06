import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 2, // Maintain at least 2 socket connections
            retryWrites: true,
            retryReads: true,
        })
        console.log('Mongodb connection has been established!')
    } catch (error) {
        console.log('MongoDb connection has failed', error.message);
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
}

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected successfully');
});

export default connectDB;