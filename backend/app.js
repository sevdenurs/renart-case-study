const express = require("express");
const cors = require("cors");
const fs = require("fs");
const productsRouter = require("./routes/products");

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:3000", 
  })
);

app.use(express.json());
app.use("/api/products", productsRouter);

app.get("/", (req, res) => {
  res.send("Express.js API is running!");
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(` Server is running on http://localhost:${port}`);
});


