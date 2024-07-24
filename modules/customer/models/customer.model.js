// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
// User Schema
var userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});



// create the model for users and expose it to our app
module.exports = mongoose.model('customers', userSchema);
