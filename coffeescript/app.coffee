express = require("express")
path = require("path")
favicon = require("static-favicon")
logger = require("morgan")
cookieParser = require("cookie-parser")
bodyParser = require("body-parser")
passport = require("passport")
settings = require("./settings")

require('monitor').start()

require("./mongo")(settings)

apiModel = require("./models/api")

# Routes
apiRoute = require("./routes/api")
routes = require("./routes/index")
group = require("./routes/group")
groups = require("./routes/groups")

# Auth routes
facebook = require("./routes/facebook")
google = require("./routes/google")
instagram = require("./routes/instagram")
profile = require("./routes/profile")


app = express()

multer = require("multer")


session = require("express-session")
MongoStore = require("connect-mongo")(session)
mongoStore = new MongoStore db: settings.db

sessionStore = session
  secret: settings.cookie_secret
  store: new MongoStore(db: settings.db)
  resave: true
  saveUninitialized: true



app.use multer(dest: path.join(__dirname, "public/uploads"))

# view engine setup
app.use express.static(path.join(__dirname, "public"))
app.set "views", path.join(__dirname, "views")
app.set "view engine", "ejs"
app.use logger("dev")
app.use bodyParser.json()
app.use bodyParser.urlencoded(extended: true)
app.use cookieParser(settings.cookie_secret)
app.use sessionStore

app.use passport.initialize()
app.use passport.session()



passport.serializeUser (user, done) ->
  done null, user._id

passport.deserializeUser (id, done) ->
  #return done null, {id: 1}

  success = (data) ->
    if data
      done null, data._id
    else
      done 'user not found'

  error = (err) ->
    done err

  apiModel
    .getUser(id)
    .then success, error


app.use "/", routes
app.use "/api", apiRoute
app.use "/auth/facebook", facebook
app.use "/auth/google", google
app.use "/auth/instagram", instagram

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
    view = "error"
    if err.status is 404
      view = "error404"

    res.status err.status or 500
    res.render view,
      message: err.message
      error: err
      stack: err.stack


# production error handler
# no stacktraces leaked to user
app.use (err, req, res, next) ->
  view = "error"
  if err.status is 404
    view = "error404"

  res.status err.status or 500
  res.render view,
    message: err.message
    #error: {}
    error: err
    stack: err.stack


app.set "port", process.env.PORT or 3000
server = app.listen app.get("port"), ->
  console.log "Express server listening on port " + server.address().port


require("./sockets")(server, sessionStore)

