const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: "http://localhost:3000", 
  })
);

app.use(express.json());
const dataPath = "./data/products.json";

app.get("/api/products", (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading products data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    try {
      const products = JSON.parse(data);
      res.json(products);
    } catch (parseErr) {
      console.error("Error parsing products data:", parseErr);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

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



