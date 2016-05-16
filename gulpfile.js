
var fs = require('fs-extra');
var gulp = require('gulp');

gulp.task('default', function () {
  fs.copy('index.html', 'dist/index.html');
  fs.copy('index.js', 'dist/index.js');
  fs.copy('index.css', 'dist/index.css');
  fs.copy('tiles.png', 'dist/tiles.png');
});
