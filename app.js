(function() {
  var MongoStore, apiModel, apiRoute, app, bodyParser, cookieParser, express, facebook, favicon, google, group, groups, instagram, logger, mongoStore, multer, passport, path, profile, routes, server, session, sessionStore, settings;

  express = require("express");

  path = require("path");

  favicon = require("static-favicon");

  logger = require("morgan");

  cookieParser = require("cookie-parser");

  bodyParser = require("body-parser");

  passport = require("passport");

  settings = require("./settings");

  require('monitor').start();

  require("./mongo")(settings);

  apiModel = require("./models/api");

  apiRoute = require("./routes/api");

  routes = require("./routes/index");

  group = require("./routes/group");

  groups = require("./routes/groups");

  facebook = require("./routes/facebook");

  google = require("./routes/google");

  instagram = require("./routes/instagram");

  profile = require("./routes/profile");

  app = express();

  multer = require("multer");

  session = require("express-session");

  MongoStore = require("connect-mongo")(session);

  mongoStore = new MongoStore({
    db: settings.db
  });

  sessionStore = session({
    secret: settings.cookie_secret,
    store: new MongoStore({
      db: settings.db
    }),
    resave: true,
    saveUninitialized: true
  });

  app.use(multer({
    dest: path.join(__dirname, "public/uploads")
  }));

  app.use(express["static"](path.join(__dirname, "public")));

  app.set("views", path.join(__dirname, "views"));

  app.set("view engine", "ejs");

  app.use(logger("dev"));

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded());

  app.use(cookieParser(settings.cookie_secret));

  app.use(sessionStore);

  app.use(passport.initialize());

  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    return done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    var error, success;
    success = function(data) {
      if (data) {
        return done(null, data._id);
      } else {
        return done('user not found');
      }
    };
    error = function(err) {
      return done(err);
    };
    return apiModel.getUser(id).then(success, error);
  });

  app.use("/", routes);

  app.use("/api", apiRoute);

  app.use("/auth/facebook", facebook);

  app.use("/auth/google", google);

  app.use("/auth/instagram", instagram);

  app.use("/profile", profile);

  app.use("/group", group);

  app.use("/groups", groups);

  app.use(function(req, res, next) {
    var err;
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
  });

  if (app.get("env") === "development") {
    app.use(function(err, req, res, next) {
      var view;
      view = "error";
      if (err.status === 404) {
        view = "error404";
      }
      res.status(err.status || 500);
      return res.render(view, {
        message: err.message,
        error: err,
        stack: err.stack
      });
    });
  }

  app.use(function(err, req, res, next) {
    var view;
    view = "error";
    if (err.status === 404) {
      view = "error404";
    }
    res.status(err.status || 500);
    return res.render(view, {
      message: err.message,
      error: err,
      stack: err.stack
    });
  });

  app.set("port", process.env.PORT || 3000);

  server = app.listen(app.get("port"), function() {
    return console.log("Express server listening on port " + server.address().port);
  });

  require("./sockets")(server, sessionStore);

}).call(this);
