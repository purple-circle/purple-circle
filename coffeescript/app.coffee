express = require("express")
path = require("path")
favicon = require("static-favicon")
logger = require("morgan")
cookieParser = require("cookie-parser")
bodyParser = require("body-parser")
passport = require("passport")

require('monitor').start()

settings = require("./settings")

require("./mongo")(settings)

# Routes
api = require("./routes/api")
routes = require("./routes/index")
facebook = require("./routes/facebook")
google = require("./routes/google")
profile = require("./routes/profile")
group = require("./routes/group")
groups = require("./routes/groups")


app = express()

session = require("express-session")
MongoStore = require("connect-mongo")(session)
mongoStore = new MongoStore db: settings.db

sessionStore = session
  secret: settings.cookie_secret
  store: new MongoStore(db: settings.db)
  resave: true
  saveUninitialized: true



# view engine setup
app.use express.static(path.join(__dirname, "public"))
app.set "views", path.join(__dirname, "views")
app.set "view engine", "ejs"
app.use logger("dev")
app.use bodyParser.json()
app.use bodyParser.urlencoded()
app.use cookieParser(settings.cookie_secret)
app.use sessionStore

app.use passport.initialize()
app.use passport.session()



passport.serializeUser (user, done) ->
  done null, user._id

passport.deserializeUser (id, done) ->
  Users = mongoose.model 'users'
  Users
    .findOne({_id: id})
    .exec (err, data) ->
      if err
        done err
      else if data
        done null, data._id
      else
        done 'user not found'

      #done null, {id: 1}


app.use "/", routes
app.use "/api", api
app.use "/auth/facebook", facebook
app.use "/auth/google", google

app.use "/profile", profile
app.use "/group", group
app.use "/groups", groups


#/ catch 404 and forwarding to error handler
app.use (req, res, next) ->
  err = new Error("Not Found")
  err.status = 404
  next err


# development error handler
# will print stacktrace
if app.get("env") is "development"
  app.use (err, req, res, next) ->
    res.status err.status or 500
    res.render "error",
      message: err.message
      error: err
      stack: err.stack


# production error handler
# no stacktraces leaked to user
app.use (err, req, res, next) ->

  console.log "err", err

  res.status err.status or 500
  res.render "error",
    message: err.message
    #error: {}
    error: err
    stack: err.stack


app.set "port", process.env.PORT or 3000
server = app.listen app.get("port"), ->
  console.log "Express server listening on port " + server.address().port


require("./sockets")(server, sessionStore)

