// routes/shopifyRestApiRoutes.js

const express = require("express");
const menuModel = require("../model/menuModel");

const router = express.Router();

router.get("/menu", async (req, res) => {
  try {
    const handle = req.query.handle || "main-menu";

    const menu = await menuModel.getShopifyMenu(handle);

    return res.json({
      success: true,
      data: menu,
    });
  } catch (error) {
    console.error("Shopify menu error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch Shopify menu",
    });
  }
});

module.exports = router;
