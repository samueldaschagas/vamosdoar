var fs = require("fs");
var rev = require("gulp-rev");
var del = require("del");
var path = require("path");
var gulp = require("gulp");
var jade = require("gulp-jade");
var sass = require("gulp-sass");
var gulpif = require("gulp-if");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var include = require("gulp-include");
var ngAnnotate = require("gulp-ng-annotate");
var serveStatic = require("serve-static");
var runSequence = require("gulp-run-sequence");
var autoprefixer = require("gulp-autoprefixer");

var browserSync = require("browser-sync").create();

var pkg = require("./package.json");

// Indicates if a build is being done for deployment or development.
var PRODUCTION;

// This is the configuration file for when your app run in development mode
var FIREBASECONFIG_DEVELOPMENT = {
    apiKey: "AIzaSyCiCSMzmcHjzm6MNiFnwkScDgBl1JwGBag",
    authDomain: "hack-devfest.firebaseapp.com",
    databaseURL: "https://hack-devfest.firebaseio.com",
    storageBucket: "hack-devfest.appspot.com",
    messagingSenderId: "401310563451"
};

// This is the configuration file for when your app run in production mode
var FIREBASECONFIG_PRODUCTION = {
    apiKey: "AIzaSyCiCSMzmcHjzm6MNiFnwkScDgBl1JwGBag",
    authDomain: "hack-devfest.firebaseapp.com",
    databaseURL: "https://hack-devfest.firebaseio.com",
    storageBucket: "hack-devfest.appspot.com",
    messagingSenderId: "401310563451"
};

var buildPaths = {
  js: ["./source/components/*.js"],
  jade: ["./source/components/*.jade"],
  scss: ["./source/scss/*.scss"],
  images: ["./source/images/**/*.*"],
  misc: ["./source/misc/**/*.*"]
};

var watchPaths = {
  js: ["./source/components/**/*.js"],
  jade: ["./source/components/**/*.jade"],
  scss: ["./source/scss/**/*.scss"],
  images: ["./source/images/**/*.*"],
  misc: ["./source/misc/**/*.*"]
};

/**
 * Builds Js files
 */

gulp.task("js", function () {
  return gulp.src(buildPaths.js)
    .pipe(include({
      includePaths: [
        path.join(__dirname, "/bower_components"),
        path.join(__dirname, "/source/components")
      ]
    }))
    .on("error", console.error) // eslint-disable-line
    .pipe(ngAnnotate())
    .pipe(gulpif(PRODUCTION, uglify({ mangle: true })))
    .pipe(rev())
    .pipe(rename({ dirname: "/js", extname: PRODUCTION ? ".min.js" : ".js" }))
    .pipe(gulp.dest("./public/"))
    .pipe(rev.manifest("source/rev-manifest.json", { merge: true }))
    .pipe(gulp.dest(""));
});

/**
 * Builds Css files
 */
gulp.task("scss", function () {
  return gulp.src(buildPaths.scss)
    .pipe(sass({ outputStyle: PRODUCTION ? "compressed" : "expanded", errLogToConsole: true }))
    .pipe(autoprefixer({ browsers: ["last 3 versions"], cascade: false }))
    .pipe(rev())
    .pipe(rename({ dirname: "/css", extname: PRODUCTION ? ".min.css" : ".css" }))
    .pipe(gulp.dest("./public/"))
    .pipe(rev.manifest("source/rev-manifest.json", { merge: true }))
    .pipe(gulp.dest(""));
});

/**
 * Copies Image files
 */
gulp.task("image", function () {
  return gulp.src(buildPaths.images)
    .pipe(gulp.dest("./public/images/"));
});

/**
 * Copies Other files
 */
gulp.task("misc", function () {
  return gulp.src(buildPaths.misc)
    .pipe(gulp.dest("./public/misc/"));
});

/**
 * Builds Html files
 */
gulp.task("jade", function () {
  if (PRODUCTION) {
    console.log("Compilando jade para produção...");
  }

  return gulp.src(buildPaths.jade)
    .pipe(jade({
      pretty: !PRODUCTION,
      locals: {
        // eslint-disable-next-line
        manifest: JSON.parse(fs.readFileSync("./source/rev-manifest.json", "utf8")),
        production: PRODUCTION,
        version: pkg.version,
        firebaseConfig: PRODUCTION ? FIREBASECONFIG_PRODUCTION : FIREBASECONFIG_DEVELOPMENT
      }
    }))
    .on("error", console.error)
    .pipe(gulp.dest("./public/"));
});

/**
 * Deletes the public folder
 */
gulp.task("clean", function () { return del(["./public/"]); });

/**
 * Cleans then builds everything
 */
gulp.task("build", function (done) {
  return runSequence("clean", ["js", "scss", "image", "misc"], "jade", done);
});

/**
 * Serves the public folder
 */
gulp.task("serve", function () {
  return browserSync.init({ server: {
    baseDir: "./public/",
    middleware: [serveStatic("./public/", { extensions: ["html"] })]
  } });
});

/**
 * Reloads the browser
 */
gulp.task("reload", function () { return browserSync.reload(); });

/**
 * Watches file changes and runs watch tasks
 */
gulp.task("watch", function () {
  gulp.watch(watchPaths.js, ["watch-js"]);
  gulp.watch(watchPaths.scss, ["watch-scss"]);
  gulp.watch(watchPaths.jade, ["watch-jade"]);
});

/**
 * Watch Tasks
 */
gulp.task("watch-js", function (done) { runSequence("js", "jade", "reload", done); });
gulp.task("watch-scss", function (done) { runSequence("scss", "jade", "reload", done); });
gulp.task("watch-jade", function (done) { runSequence("jade", "reload", done); });

/**
 * Default Task - Runs build, serve, watch
 */
gulp.task("default", function (done) { runSequence("build", "serve", "watch", done); });
