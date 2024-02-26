const fs = require("fs");
const gulp = require("gulp");
const replace = require("gulp-replace");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const dotenv = require("dotenv");
const gulpif = require("gulp-if");

const envStr = `.env.${process.env.NODE_ENV}`;

dotenv.config({ path: envStr });

gulp.task("default", function () {
  const envVariables = dotenv.parse(fs.readFileSync(envStr.trim()));
  const keys = Object.keys(envVariables);
  const pattern = new RegExp(`${keys.join("|")}`);
  const isProd = envStr.includes("production");

  return gulp
    .src("src/index.js")
    .pipe(
      replace(pattern, function (match) {
        const val = envVariables[match];
        console.log({ val }, typeof val);
        return `"${val}"`;
      })
    )
    .pipe(gulpif(isProd, uglify()))
    .pipe(rename(!isProd ? "index.js" : "index.min.js"))
    .pipe(gulp.dest("dist"));
});
