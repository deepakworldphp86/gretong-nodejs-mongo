require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Admin = require("../modules/admin/models/adminModel");

const { MONGO_URI } = process.env;

async function migrate() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected");

    const exists = await Admin.findOne({ username: "admin" });

    if (exists) {
      console.log("Admin already exists");
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({
      username: "admin",
      password: hashedPassword,
    });

    console.log("Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}

migrate();