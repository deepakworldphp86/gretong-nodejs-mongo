// routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// GET home page
router.get("/", customerController.getHomePage);

// Register Process
router.post("/register", customerController.registerUser);

// Login Process
router.post("/login", customerController.loginUser);

// Logout Process
router.get("/logout", customerController.logoutUser);

// Sample route (for demonstration purposes)
router.get('/users', (req, res) => {
  res.send('respond with a resource');
});

module.exports = router;
