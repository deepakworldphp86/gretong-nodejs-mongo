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
const app = require('./app_config.js');
const modulesPath = app.locals.modulesPath;
const corePath = app.locals.corePath;

// GraphQL Schema and Resolvers
const productTypeDefs = require(path.join(modulesPath, 'product', 'graphql', 'schema.graphqls'));
const productResolvers = require(path.join(modulesPath, 'product', 'graphql', 'resolver.graphql'));
const categoryTypeDefs = require(path.join(modulesPath, 'category', 'graphql', 'schema.graphqls'));
const categoryResolvers = require(path.join(modulesPath, 'category', 'graphql', 'resolver.graphql'));
const customerTypeDefs = require(path.join(modulesPath, 'customer', 'graphql', 'schema.graphqls'));
const customerResolvers = require(path.join(modulesPath, 'customer', 'graphql', 'resolver.graphql'));

// Merge typeDefs and resolvers
const typeDefs = mergeTypeDefs([productTypeDefs, categoryTypeDefs, customerTypeDefs]);
const resolvers = mergeResolvers([productResolvers, categoryResolvers, customerResolvers]);

// Middleware
const common = require(`${corePath}/middleware/middleware_frontend.js`);

// Routers
const indexRouter = require(path.join(modulesPath, 'frontend', 'routes', 'index'));
const usersRouter = require(path.join(modulesPath, 'customer', 'routes', 'users'));
const apiRouter = require(path.join(modulesPath, 'rest', 'routes', 'api'));
const registerRouter = require(path.join(modulesPath, 'customer', 'routes', 'register'));
const adminRouter = require(path.join(modulesPath, 'admin', 'routes', 'admin'));
const productRouter = require(path.join(modulesPath, 'product', 'routes', 'product'));
const categoryRouter = require(path.join(modulesPath, 'category', 'routes', 'category'));
const quizRouter = require(path.join(modulesPath, 'quiz', 'routes', 'quiz'));
const salesRouter = require(path.join(modulesPath, 'sales', 'routes', 'orders'));

//REST API Routes
const productRestApiRouter = require(path.join(modulesPath, 'product', 'routes', 'rest', 'api'));
const categoryRestApiRouter = require(path.join(modulesPath, 'category', 'routes', 'rest', 'api'));
const salesRestApiRouter = require(path.join(modulesPath, 'sales', 'routes', 'rest', 'api'));



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
require(`${corePath}/config/passport`)(passport);
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

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/rest/api", apiRouter);
app.use("/register", registerRouter);
app.use("/admin", adminRouter);
app.use("/admin/product", productRouter);
app.use("/admin/category", categoryRouter);
app.use("/admin/quiz", quizRouter);
app.use("/product/rest", productRestApiRouter);
app.use("/category/rest", categoryRestApiRouter);
app.use("/admin/orders", salesRouter);
app.use("/orders/rest", salesRestApiRouter);

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
