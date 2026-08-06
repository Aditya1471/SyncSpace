import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the .env file.");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ MongoDB Connected Successfully");
    console.log(`📦 Database : ${conn.connection.name}`);
    console.log(`🌐 Host     : ${conn.connection.host}`);
    console.log(`🔌 Port     : ${conn.connection.port}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB Disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB Reconnected");
    });

    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB Error:", error.message);
    });
  } catch (error) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ MongoDB Connection Failed");
    console.error(`Reason : ${error.message}`);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Check if error is related to DNS/SRV/Server Selection resolution
    const isDNSProblem = 
      error.name === "MongooseServerSelectionError" || 
      /ENOTFOUND|EREFUSED|dns|srv|timeout/i.test(error.message);

    if (isDNSProblem) {
      console.warn("⚠️  DIAGNOSTICS & TROUBLESHOOTING:");
      console.warn("   This error indicates a DNS/SRV resolution problem rather than incorrect credentials.");
      console.warn("   Please check the following steps to resolve this:");
      console.warn("   1. Verify your MONGO_URI in the server .env is exactly copied from MongoDB Atlas (Connect -> Drivers).");
      console.warn("   2. Change your DNS server to Google Public DNS:");
      console.warn("      - Primary: 8.8.8.8");
      console.warn("      - Secondary: 8.8.4.4");
      console.warn("      - Flush DNS cache afterwards (Windows: 'ipconfig /flushdns', Mac: run flush commands).");
      console.warn("   3. Confirm your network environment. If on VPN, college Wi-Fi, or behind a firewall, try a mobile hotspot.");
      console.warn("   4. Verify Atlas Console: Confirm you can access https://cloud.mongodb.com normally and the cluster is active.");
      console.warn("   5. Node.js version check: Run 'node -v' to check your version.");
      console.warn("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    process.exit(1);
  }
};

export default connectDB;