const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Check if the MongoDB URI is defined
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in the environment variables.");
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log("====================================");
        console.log("✅ MongoDB Connected Successfully");
        console.log(`Host      : ${conn.connection.host}`);
        console.log(`Database  : ${conn.connection.name}`);
        console.log(`Port      : ${conn.connection.port}`);
        console.log("====================================");

        // Connection event listeners
        mongoose.connection.on("connected", () => {
            console.log("📡 Mongoose connected to MongoDB");
        });

        mongoose.connection.on("error", (err) => {
            console.error("❌ Mongoose connection error:", err.message);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ Mongoose disconnected");
        });

        // Graceful shutdown
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            console.log("🔴 MongoDB connection closed due to application termination");
            process.exit(0);
        });

    } catch (error) {
        console.error("====================================");
        console.error("❌ MongoDB Connection Failed");
        console.error(error.message);
        console.error("====================================");
        process.exit(1);
    }
};

module.exports = connectDB;