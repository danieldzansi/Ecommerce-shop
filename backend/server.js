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

const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(
  Boolean
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS BLOCKED:", origin);
      return callback(new Error("CORS blocked for origin: " + origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

console.log("Allowed CORS Origins:", allowedOrigins);

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
      console.log("Server running on PORT:", port);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
