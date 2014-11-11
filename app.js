(function() {
  var MongoStore, api, app, bodyParser, cookieParser, express, facebook, favicon, google, group, groups, logger, mongoStore, passport, path, profile, routes, server, session, sessionStore, settings;

  express = require("express");

  path = require("path");

  favicon = require("static-favicon");

  logger = require("morgan");

  cookieParser = require("cookie-parser");

  bodyParser = require("body-parser");

  passport = require("passport");

  require('monitor').start();

  settings = require("./settings");

  require("./mongo")(settings);

  api = require("./routes/api");

  routes = require("./routes/index");

  facebook = require("./routes/facebook");

  google = require("./routes/google");

  profile = require("./routes/profile");

  group = require("./routes/group");

  groups = require("./routes/groups");

  app = express();

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
    var Users;
    Users = mongoose.model('users');
    return Users.findOne({
      _id: id
    }).exec(function(err, data) {
      if (err) {
        return done(err);
      } else if (data) {
        return done(null, data._id);
      } else {
        return done('user not found');
      }
    });
  });

  app.use("/", routes);

  app.use("/api", api);

  app.use("/auth/facebook", facebook);

  app.use("/auth/google", google);

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
      res.status(err.status || 500);
      return res.render("error", {
        message: err.message,
        error: err,
        stack: err.stack
      });
    });
  }

  app.use(function(err, req, res, next) {
    console.log("err", err);
    res.status(err.status || 500);
    return res.render("error", {
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
