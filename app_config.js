// Required modules
const express = require("express");
const path = require("path");

// Create Express app instance
const app = express();

// Define paths
const modulesPath = path.join(__dirname, "modules");
const publicPath = path.join(__dirname, "public");
const corePath = path.join(__dirname, "core");

const layoutFrontendPath = path.join(publicPath, "frontend", "views", "layouts");
const layoutBackendPath = path.join(publicPath, "backend", "views", "layouts");
//const viewPath = path.join(modulesPath, "frontend", "views");


// Set paths globally using app.locals
app.locals.modulesPath = modulesPath;
app.locals.publicPath = publicPath;
app.locals.layoutFrontendPath = layoutFrontendPath;
app.locals.layoutBackendPath = layoutBackendPath;
app.locals.corePath = corePath;


// Export the Express app instance
module.exports = app;
