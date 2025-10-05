const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { getGoldPrice } = require("../services/goldPriceServices");


router.get("/", async (req, res) => {
  try {
    const productsPath = path.join(__dirname, "../data/products.json");
    const productsData = fs.readFileSync(productsPath, "utf-8");
    const products = JSON.parse(productsData);

    const goldPrice = await getGoldPrice();
    if (!goldPrice) {
      throw new Error("Altın fiyatı alınamadı.");
    }

    const productsWithPrice = products.map((product) => {
      const { popularityScore, weight } = product;
      const price = (popularityScore + 1) * weight * goldPrice;

      return {
        ...product,
        price: price.toFixed(2), 
      };
    });

    res.json(productsWithPrice);
  } catch (err) {
    console.error("Hata:", err);
    res.status(500).json({ error: "Ürünler alınamadı." });
  }
});

const dataPath = "./data/products.json";

router.get("/products", (req, res) => {
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

module.exports = router;
