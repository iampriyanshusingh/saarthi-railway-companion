const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const rateLimit = require("express-rate-limit");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const stationRoutes = require("./routes/station");
const bookingRoutes = require("./routes/booking");

// Import socket handlers
const socketHandlers = require("./sockets/socketHandlers");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(limiter);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/saarthi";
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    initializeDatabase();
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });

// Initialize database with sample data
async function initializeDatabase() {
  try {
    const Train = require("./models/Train");
    const Station = require("./models/Station");

    // Check if data already exists
    const trainCount = await Train.countDocuments();
    const stationCount = await Station.countDocuments();

    if (trainCount === 0) {
      // Create sample trains
      const sampleTrains = [
        {
          trainNumber: "12345",
          trainName: "Rajdhani Express",
          source: "New Delhi",
          destination: "Mumbai Central",
          platform: "Platform 1",
          scheduledArrival: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          scheduledDeparture: new Date(Date.now() + 2.5 * 60 * 60 * 1000), // 2.5 hours from now
          status: "On Time",
          delay: 0,
        },
        {
          trainNumber: "67890",
          trainName: "Shatabdi Express",
          source: "Chennai Central",
          destination: "Bangalore",
          platform: "Platform 3",
          scheduledArrival: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
          scheduledDeparture: new Date(Date.now() + 1.25 * 60 * 60 * 1000), // 1.25 hours from now
          status: "Delayed",
          delay: 15,
        },
        {
          trainNumber: "11111",
          trainName: "Duronto Express",
          source: "Kolkata",
          destination: "New Delhi",
          platform: "Platform 2",
          scheduledArrival: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
          scheduledDeparture: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
          status: "On Time",
          delay: 0,
        },
      ];

      await Train.insertMany(sampleTrains);
      console.log("✅ Sample trains created");
    }

    if (stationCount === 0) {
      // Create sample station data
      const stationData = {
        name: "Central Railway Station",
        code: "CRS",
        facilities: [
          {
            name: "Food Court",
            type: "dining",
            location: { x: 150, y: 200 },
            description: "Multiple restaurants and fast food options",
            isAccessible: true,
          },
          {
            name: "Restroom - Men",
            type: "restroom",
            location: { x: 100, y: 150 },
            description: "Male restroom facilities",
            isAccessible: true,
          },
          {
            name: "Restroom - Women",
            type: "restroom",
            location: { x: 120, y: 150 },
            description: "Female restroom facilities",
            isAccessible: true,
          },
          {
            name: "Information Desk",
            type: "information",
            location: { x: 200, y: 100 },
            description: "Station information and assistance",
            isAccessible: true,
          },
          {
            name: "Ticket Counter",
            type: "ticketing",
            location: { x: 50, y: 100 },
            description: "Train ticket booking and reservations",
            isAccessible: true,
          },
          {
            name: "ATM",
            type: "banking",
            location: { x: 250, y: 150 },
            description: "Automated Teller Machine",
            isAccessible: true,
          },
          {
            name: "Pharmacy",
            type: "medical",
            location: { x: 180, y: 250 },
            description: "Medical supplies and basic healthcare",
            isAccessible: true,
          },
        ],
        platforms: [
          {
            number: 1,
            location: { x: 300, y: 50 },
            length: 400,
            isAccessible: true,
          },
          {
            number: 2,
            location: { x: 300, y: 150 },
            length: 400,
            isAccessible: true,
          },
          {
            number: 3,
            location: { x: 300, y: 250 },
            length: 400,
            isAccessible: true,
          },
        ],
      };

      await Station.create(stationData);
      console.log("✅ Sample station data created");
    }
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/station", stationRoutes);
app.use("/api", bookingRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Saarthi Railway Assistant API is running",
    timestamp: new Date().toISOString(),
  });
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("👤 User connected:", socket.id);
  socketHandlers(socket, io);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Saarthi server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready for real-time connections`);
  console.log(`🌐 API available at http://localhost:${PORT}/api`);
});

module.exports = { app, server, io };
