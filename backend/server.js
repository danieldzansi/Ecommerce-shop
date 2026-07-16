import express from "express";
import cors from "cors";
import "dotenv/config";
import paystackRoutes from "./routes/paystackroute.js";
import { testConnection } from "./db/index.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminroute.js";
import productRouter from "./routes/productroute.js";
import orderRouter from "./routes/orderroute.js";

const app = express();
const port = process.env.PORT || 4000;

connectCloudinary();

app.use(express.json());

const localDevOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
];

const productionOrigins = [
  "https://eclatdelee.com",
  "https://www.eclatdelee.com",
];

const parseOrigins = (value) =>
  String(value || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

const envOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  process.env.VITE_FRONTEND_URL,
  process.env.VITE_ADMIN_URL,
]
  .flatMap(parseOrigins);

const allowedOrigins = [
  ...new Set([...envOrigins, ...productionOrigins, ...localDevOrigins]),
];

console.log(
  "Allowed CORS Origins:",
  allowedOrigins.length ? allowedOrigins : "none"
);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Authorization"],
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("API is Working");
});

app.use("/api/paystack", paystackRoutes);
app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/orders", orderRouter);

const start = async () => {
  try {
    await testConnection();
    app.listen(port, () => {
      console.log(`Server running on PORT: ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
