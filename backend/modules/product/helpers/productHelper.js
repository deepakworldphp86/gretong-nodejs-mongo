const multer = require('multer');
const path = require('path');
const app = require('../../../appConfig.js');
const { productModel } = require('../models/productModel.js'); // Adjust the path as needed

const publicPath = app.locals.publicPath;

/************************** Upload Config *************************/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(publicPath, '/admin/uploads/product_images/')); // Use path.join for cross-platform compatibility
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname); // Add file extension
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

const upload = multer({ storage: storage });

/************************** Unique ID Generation *************************/
async function generateUniqueProductId() {
    let productId = await findNextAvailableId(); // Start checking from ID 1
    return productId;
}

async function findNextAvailableId() {
    let candidateId = 1; // Start checking from ID 1

    while (true) {
        let product = await productModel.findOne({ id: candidateId }).exec();

        if (!product) {
            return candidateId; // If the ID does not exist, return it as the next available ID
        }

        candidateId++; // Increment candidateId and check the next ID
    }
}

/************************** Exporting *************************/
module.exports = {
    upload,
    generateUniqueProductId,
    findNextAvailableId
};
