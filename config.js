//Required lib
var express = require("express");
var app = express();
var path = require("path");

module.exports = {
  modulePath: function () {
    //Modules
    app.set("modules", path.join(__dirname, "modules"));
    var modulePath = app.get("modules");
    return modulePath;
  },
  publicPath: function () {
    //Modules
    app.set("modules", path.join(__dirname, "public"));
    var publicPath = app.get("public");
    return publicPath;
  },
  layoutFrontend: function () {
    //Modules
    app.set("modules", path.join(__dirname, "public"));
    var layoutFrontend = app.get("modules/frontend/view/layouts");
    return layoutFrontend;
  },
  layoutBackend: function () {
    //Modules
    app.set("modules", path.join(__dirname, "public"));
    var layoutBackend = app.get("modules/backend/view/layouts");
    return layoutBackend;
  },
};
