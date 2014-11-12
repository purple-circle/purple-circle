gulp = require("gulp")
plumber = require('gulp-plumber')

gutil = require("gulp-util")
coffee = require("gulp-coffee")

# Css
less = require("gulp-less")
minifycss = require("gulp-minify-css")
postcss = require("gulp-postcss")
autoprefixer = require("autoprefixer-core")


# Code linting
jshint = require("gulp-jshint")
coffeelint = require('gulp-coffeelint')

# Code minification
concat = require("gulp-concat")
uglify = require("gulp-uglify")

# Angular
protractor = require("gulp-protractor").protractor
ngTemplates = require("gulp-ng-templates")
ngAnnotate = require('gulp-ng-annotate')

# Code analysis
plato = require("gulp-plato")

# Notifications for OSX
notify = require("gulp-notify")


errorHandler = notify.onError("Error: <%= error.message %>")

gulp.task "coffee", ->

  # Build frontend coffee
  gulp
    .src("coffeescript/public/**/*.coffee")
    .pipe(plumber({errorHandler}))
    .pipe(coffee())
    .on('error', gutil.log)
    .on('error', gutil.beep)
    .pipe(ngAnnotate())
    .pipe(concat("build.js"))
    .pipe(gulp.dest("./public/js"))


  # Build rest
  gulp
    .src([
      "coffeescript/**/*.coffee"
      "!coffeescript/public/**/*.coffee"
    ])
    .pipe(plumber({errorHandler}))
    .pipe(coffee())
    .on('error', gutil.log)
    .on('error', gutil.beep)
    .pipe(gulp.dest("./"))


gulp.task "less", ->
  gulp
    .src("less/**/*.less")
    .pipe(plumber({errorHandler}))
    .pipe(less())
    .pipe(gulp.dest("./public/css"))


gulp.task "autoprefixer", ->
  gulp
    .src("public/css/*.css")
    .pipe(postcss([autoprefixer(browsers: ["last 5 version"])]))
    .pipe gulp.dest("public/css")


gulp.task "lint", ->
  gulp
    .src([
      "routes/*.js"
      "public/**/*.js"
      "public/js/build.js"
      "!node_modules/**/*.js"
      "!public/report/**/*.js"
      "!public/bower_components/**/*.js"
    ])
    .pipe(plumber({errorHandler}))
    .pipe(jshint())
    .pipe(jshint.reporter("default"))
    .on('error', gutil.beep)
    .pipe notify (file) ->
      # Don't show something if success
      if file.jshint.success
        return false

      errors = file.jshint.results.map((data) ->
        if data.error
          "(" + data.error.line + ":" + data.error.character + ") " + data.error.reason
      ).join("\n")
      "#{file.relative} (#{file.jshint.results.length} errors)\n#{errors}"



gulp.task "partials", ->
  gulp
    .src('public/views/**/*.html')
    .pipe(ngTemplates())
    .pipe(gulp.dest("public/js/templates"))


gulp.task "test", ->
  gulp
    .src(["/test/specs/**/*.js"])
    .pipe(protractor(
      configFile: "test/conf.js"
    ))
    .pipe(plumber({errorHandler}))
    .on('error', gutil.log)
    .on('error', gutil.beep)


gulp.task "plato", ->
  gulp
    .src([
      "app.js"
      "routes/**/*.js"
      "public/js/build.js"
      "test/**/*.js"
    ])
    .pipe plato "public/report",
      jshint:
        options:
          strict: true
      complexity:
        trycatch: true



gulp.task "build", ->
  gulp.start("coffee")
  gulp.start("partials")
  gulp.start("less")
  gulp.start("autoprefixer")

  gulp
    .src("public/js/build.js")
    .pipe(uglify())
    .pipe(gulp.dest("public/js"))

  gulp
    .src("public/css/style.css")
    .pipe(minifycss())
    .pipe(gulp.dest("public/css"))

  gulp.start("lintcode")
  gulp.start("plato")


gulp.task "coffeelint", ->
  gulp
    .src("coffeescript/**/*.coffee")
    .pipe(plumber({errorHandler}))
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
    .pipe(coffeelint.reporter('fail'))
    .on('error', gutil.log)
    .on('error', gutil.beep)

gulp.task "lintcode", ->
  gulp.start("coffeelint")
  gulp.start("lint")


gulp.task "watch", ->
  gulp.watch "coffeescript/**/*.coffee", ["coffeelint", "coffee"]
  gulp.watch "less/**/*.less", ["less"]
  gulp.watch "public/css/*.css", ["autoprefixer"]
  gulp.watch "public/views/**/*.html", ["partials"]

  gulp.watch [
    "app.js"
    "routes/**/*.js"
    "public/**/*.js"
    "!node_modules/**/*.js"
    "!public/report/**/*.js"
    "!public/bower_components/**/*.js"
  ], ["lint"]

