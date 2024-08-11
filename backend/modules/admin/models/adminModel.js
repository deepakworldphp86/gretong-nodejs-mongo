var Mongoose = require("mongoose");
// Define schema
var adminSchema = Mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { strict: false }
);

// Compile model from schema
module.exports = Mongoose.model("admin", adminSchema);
