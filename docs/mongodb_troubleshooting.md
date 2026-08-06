# MongoDB Atlas DNS/SRV Troubleshooting Guide

If you encounter a `MongooseServerSelectionError` or a DNS/SRV resolution error while connecting to MongoDB Atlas, it typically indicates a network, firewall, or DNS resolution issue rather than incorrect credentials. Follow the steps below to resolve it.

---

## 📋 Diagnostics Checklist

Please verify the following points to isolate the issue:

1. **Connection String Verification**:
   * Is the `MONGO_URI` in your `.env` file copied exactly from **MongoDB Atlas → Connect → Drivers**?
   * Does it use the `mongodb+srv://` protocol?
2. **Cluster Availability**:
   * Log into MongoDB Atlas and verify that the cluster status shows **Available** (not paused, terminating, or still deploying).
3. **Atlas Console Access**:
   * Can you open [cloud.mongodb.com](https://cloud.mongodb.com) normally in your web browser?
4. **Network Restrictions**:
   * Are you behind a VPN, college Wi-Fi, corporate proxy, or strict firewall?
   * If yes, try switching to a mobile hotspot or different network to test connection.
5. **Node.js Environment**:
   * What version of Node.js are you running? Verify by running:
     ```bash
     node -v
     ```

---

## 🛠️ Solutions to Try

### 1. Change Your DNS Servers
DNS servers provided by local ISPs or private networks sometimes fail to resolve SRV records properly.
* Change your system DNS servers to Google Public DNS:
  * **Primary (IPv4)**: `8.8.8.8`
  * **Secondary (IPv4)**: `8.8.4.4`
* Clear your DNS cache:
  * **Windows (PowerShell/CMD)**: `ipconfig /flushdns`
  * **macOS**: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`

### 2. Configure IP Access List in Atlas
MongoDB Atlas blocks all incoming connections by default.
* Go to the Atlas Dashboard under **Security → Network Access**.
* Click **Add IP Address** and add your current IP address.
* For troubleshooting purposes, you can temporarily allow access from anywhere by adding `0.0.0.0/0`.

### 3. Fallback to Standard Connection String (non-SRV)
If DNS SRV resolution continues to fail, you can use the older connection format (Node.js 2.2.12 or later driver string):
```env
# Example format using standard connection scheme
MONGO_URI="mongodb://<username>:<password>@cluster0-shard-00-00.mongodb.net:27017,cluster0-shard-00-01.mongodb.net:27017,cluster0-shard-00-02.mongodb.net:27017/syncspace?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"
```

---

## ✉️ Next Steps
If the connection is still failing after trying the checklist:
1. Share your current connection string format (replace your actual password with a placeholder like `<password>`).
2. Share the configuration of your [`.env`](file:///c:/Users/iamad/OneDrive/Desktop/SyncSpace/server/.env) (without exposing password keys).
3. Provide the exact console error message traceback.
