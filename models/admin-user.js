var mongoose = require('mongoose');
// Define schema
var Schema = mongoose.Schema;

var adminSchema = new Schema({
    username: String,
    password: String
});

// Compile model from schema
module.exports = mongoose.model('Admin', adminSchema);


