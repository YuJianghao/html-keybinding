const { series, dest, src, parallel } = require("gulp");
const uglify = require("gulp-uglify-es").default;
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const del = require("delete");

function clean() {
  return del(["dist"]);
}

function compile() {
  return tsProject.src().pipe(tsProject()).pipe(dest("dist"));
}

function copy() {
  return src("src/**/*.js").pipe(dest("dist"));
}

function minify() {
  return src(["dist/**/*.js"]).pipe(uglify()).pipe(dest("dist"));
}

exports.dev = series(clean, parallel(compile, copy))

exports.default = series(clean, parallel(compile, copy), minify);
