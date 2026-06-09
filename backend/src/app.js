require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const fs = require("fs");

// Routes
const routes = require("./routes/index");

const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Parse DATABASE_URL untuk MySQL session store
const dbUrl = new URL(process.env.DATABASE_URL);
const sessionStoreOptions = {
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", ""),
  createDatabaseTable: true,
  schema: {
    tableName: "sessions",
    columnNames: {
      session_id: "session_id",
      expires: "expires",
      data: "data",
    },
  },
};

const sessionStore = new MySQLStore(sessionStoreOptions);

// Trust proxy
app.set("trust proxy", 1);

// Session middleware
app.use(
  session({
    name: "alumni.sid",
    secret: process.env.SESS_SECRET || "dev-secret-change-this",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: parseInt(process.env.SESSION_EXPIRY) || 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    },
    rolling: true,
  })
);

// Security & Performance middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(compression());
}

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const allowedOrigins = (
        process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:5174"
      ).split(",");
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", env: process.env.NODE_ENV });
});

// API Routes
app.use("/api/v1", routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Terjadi kesalahan server",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`✅ Server berjalan di port ${PORT} (mode: ${process.env.NODE_ENV})`);
  // Seed initial data
  try {
    const { seedDatabase } = require("./seed");
    await seedDatabase();
  } catch (e) {
    console.warn("Seed skipped:", e.message);
  }
});

module.exports = app; // trigger reload
