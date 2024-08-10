/************ SetUp Start ************/

// Required Packages
const express = require("express");
const path = require("path");
const dotenv = require('dotenv').config();
const expressValidator = require("express-validator");
const passport = require("passport");
const flash = require("connect-flash");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const { ApolloServer } = require('apollo-server-express');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');

// Application Configuration
const app = require('./appConfig.js');
const modulesPath = app.locals.modulesPath;
const corePath = app.locals.corePath;

// GraphQL Schema and Resolvers
const productTypeDefs = require(path.join(modulesPath, 'product', 'graphql', 'schemaGraphqls'));
const productResolvers = require(path.join(modulesPath, 'product', 'graphql', 'resolverGraphql'));
const categoryTypeDefs = require(path.join(modulesPath, 'category', 'graphql', 'schemaGraphqls'));
const categoryResolvers = require(path.join(modulesPath, 'category', 'graphql', 'resolverGraphql'));
const customerTypeDefs = require(path.join(modulesPath, 'customer', 'graphql', 'schemaGraphqls'));
const customerResolvers = require(path.join(modulesPath, 'customer', 'graphql', 'resolverGraphql'));

// Merge typeDefs and resolvers
const typeDefs = mergeTypeDefs([productTypeDefs, categoryTypeDefs, customerTypeDefs]);
const resolvers = mergeResolvers([productResolvers, categoryResolvers, customerResolvers]);



// Routers
const frontendRoutes = require(path.join(modulesPath, 'frontend', 'routes', 'frontendRoutes'));
const customerFrontendRouter = require(path.join(modulesPath, 'customer', 'routes', 'customerFrontendRoutes'));
const adminRouter = require(path.join(modulesPath, 'admin', 'routes', 'adminRoutes'));
const productAdminRouter = require(path.join(modulesPath, 'product', 'routes', 'productAdminRoutes'));
const categoryAdminRouter = require(path.join(modulesPath, 'category', 'routes', 'categoryAdminRoutes'));
const quizAdminRouter = require(path.join(modulesPath, 'quiz', 'routes', 'quizAdminRoutes'));
const salesAdminRouter = require(path.join(modulesPath, 'sales', 'routes', 'ordersAdminRoutes'));

//REST API Routes
const apiRouter = require(path.join(modulesPath, 'rest', 'routes', 'api'));
const productRestApiRouter = require(path.join(modulesPath, 'product', 'routes', 'productRestApiRoutes'));
const categoryRestApiRouter = require(path.join(modulesPath, 'category', 'routes', 'categoryRestApiRoutes'));
const salesRestApiRouter = require(path.join(modulesPath, 'sales', 'routes', 'salesRestApiRoutes'));



// Configuration
app.set("view engine", "ejs");
app.set('views', `${modulesPath}/`);
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressValidator());

// Session Setup
app.use(session({
  secret: "ilovescotchscotchyscotchscotch",
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
  resave: true,
  saveUninitialized: true,
  store: new MongoDbStore({
    uri: 'mongodb://localhost:27017/greatcart',
    collection: 'mySessions'
  })
}));

// Passport Setup
require(`${modulesPath}/customer/helpers/customerPassport`)(passport);
app.use(passport.initialize());
app.use(passport.session());

// Flash Messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("successMsg");
  res.locals.errorMsg = req.flash("errorMsg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});



// Routes Admin
app.use("/admin", adminRouter);
app.use("/admin/product", productAdminRouter);
app.use("/admin/category", categoryAdminRouter);
app.use("/admin/quiz", quizAdminRouter);
app.use("/admin/orders", salesAdminRouter);

// Routes Front
app.use("/", frontendRoutes);
app.use("/customer", customerFrontendRouter);

//Rest Api Routes
app.use("/category/rest", categoryRestApiRouter);
app.use("/orders/rest", salesRestApiRouter);
app.use("/product/rest", productRestApiRouter);

// app.use("/rest/api", apiRouter);


// Error Handlers
app.use((req, res, next) => {
  res.status(404);
  res.render("frontend/views/404", { title: "404: File Not Found" });
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("frontend/views/error");
});

// Middleware to log request protocol
app.use("/admin", (req, res, next) => {
  console.log("A request for things received at " + Date.now());
  next();
});



// Start Apollo Server

const getTokenFromHeaders = (req) => {
  const authorization = req.headers.authorization || '';
  if (authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

async function startApolloServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = getTokenFromHeaders(req);
      return { token };
    }
  });
  await server.start();
  server.applyMiddleware({ app });

  await new Promise(resolve => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);

  return { server, app };
}

startApolloServer();

// Export the Express app
module.exports = app;
