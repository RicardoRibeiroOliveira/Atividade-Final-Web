const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, message: "GeekShop online" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api", notFound);

app.use((_request, response) => {
  response.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
app.use(errorHandler);

module.exports = app;
