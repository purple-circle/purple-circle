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
    .src("less/style.less")
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
      "!public/report/**/*.js"
      "!public/js/libs/**/*.js"
      "!node_modules/**/*.js"
      "!public/bower_components/**/*.js"
      "public/js/build.js"
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

gulp.task "concat", ->
  gulp
    .src([
      "!public/js/libs/*.js"
      "!public/js/build.js"
      "!node_modules/**/*.js"
      "!public/bower_components/**/*.js"
      "!public/js/templates/*.js"
      "!public/report/**/*.js"
      "public/js/**/*.js"
    ])
    .pipe(ngAnnotate())
    .pipe(concat("build.js"))
    .pipe(gulp.dest("./public/js"))


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

  gulp
    .src([
      "!public/js/libs/*.js"
      "!public/js/build.js"
      "public/js/**/*.js"
    ])
    .pipe(concat("build.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./public/js"))

  gulp
    .src("./public/css/style.css")
    .pipe(minifycss())
    .pipe(gulp.dest("./public/css"))



gulp.task "default", ->

  gulp.watch "coffeescript/**/*.coffee", ["coffee"]
  gulp.watch [
    "**/*.js"
    "!node_modules/**/*.js"
    "!public/report/**/*.js"
    "!public/bower_components/**/*.js"
  ], ["lint"]

  gulp.watch "less/**/*.less", ["less"]
  gulp.watch "public/css/*.css", ["autoprefixer"]
  gulp.watch "public/views/**/*.html", ["partials"]

  gulp.watch [
    "app.js"
    "routes/**/*.js"
    "public/**/*.js"
    "!node_modules/**/*.js"
    "!public/report/**/*.js"
    "!public/js/libs/**/*.js"
  ], ["lint"]

