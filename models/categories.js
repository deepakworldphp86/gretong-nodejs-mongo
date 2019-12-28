// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
// User Schema
var categoriesSchema = mongoose.Schema({
    categories: {
        type: String,
        required: true
    },
    categories_image: {
        type: String,
        required: true
    },
    categories_description: {
        type: String,
        required: true
    },
    categories_content: {
        type: String,
        required: true
    },
     parent_category: {
        type: String,
        required: true
    }
});



// create the model for users and expose it to our app
module.exports = mongoose.model('Categories', categoriesSchema);
