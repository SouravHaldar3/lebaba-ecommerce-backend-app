const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

/* =======================
   Middleware
======================= */
app.use(express.json({ limit: "25mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://lebaba-frontend-final-wine.vercel.app" // add frontend url
    ],
    credentials: true,
  })
);

/* =======================
   Routes
======================= */
const uploadImage = require("../src/utils/uploadImage");

const authRoutes = require("../src/users/user.route");
const productRoutes = require("../src/products/products.route");
const reviewRoutes = require("../src/reviews/reviews.router");
const orderRoutes = require("../src/orders/orders.route");
const statsRoutes = require("../src/stats/stats.route");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", statsRoutes);

/* =======================
   Test Route (IMPORTANT)
======================= */
app.get("/", (req, res) => {
  res.send("Lebaba E-commerce Server is running 🚀");
});

app.post("/uploadImage", async (req, res) => {
  try {
    const url = await uploadImage(req.body.image);
    res.send(url);
  } catch (err) {
    res.status(500).send(err);
  }
});

/* =======================
   MongoDB Connection
======================= */
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.DB_URL);
  isConnected = true;
  console.log("MongoDB connected");
}

connectDB();

/* =======================
   EXPORT (VERY IMPORTANT)
======================= */
module.exports = app;
