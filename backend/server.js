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

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

console.log("Allowed CORS Origins:", allowedOrigins);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);


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
