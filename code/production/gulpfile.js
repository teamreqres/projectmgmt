var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');

var sourcePath = 'build';
var destinationPath = 'public';

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

gulp.task('scripts', function() {

	var folders = getFolders(sourcePath + '/js');

	var tasks = folders.map(function(folder) {
		// concat into foldername.js
		// write to output
		// minify
		// rename to folder.min.js
		// write to output again
		return gulp.src(path.join(sourcePath + '/js', folder, '/**/*.js'))
			.pipe(concat(folder + '.js'))
			.pipe(uglify())
			.pipe(rename(folder + '.min.js'))
			.pipe(gulp.dest(destinationPath + '/js'));
	});

	// process all remaining files in scriptsPath root into main.js and main.min.js files
	var root = gulp.src(path.join(sourcePath + '/js', '/*.js'))
		.pipe(uglify())
		.pipe(rename('main.min.js'))
		.pipe(gulp.dest(destinationPath + '/js'));

   return merge(tasks, root);
});

gulp.task('sass', function () {
  return gulp.src('./' + sourcePath + '/scss/style.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./' + destinationPath + '/css'));
});

gulp.task('default',['scripts', 'sass']);