var gulp = require('gulp');
var bs = require('browser-sync');
var reload = bs.reload;
var babelify = require('babelify');
var react = require('babel-preset-react')
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var transform = require('transform');


function swallowError (error) {
    console.log(error.toString());
    this.emit("end");
}

gulp.task('serve', function(){
  bs({
    port: 4500,
    server: {
      baseDir: './client'
    }
  });
});

gulp.task('browserify', function() {
	return browserify({
		entries:['./client/app.js'],
		debug: true
	})
	.transform(babelify.configure({presets:"react"}))
	.on('error', swallowError)	
	.bundle()
	.on('error', swallowError)
	.pipe(source('bundle.js'))
	.on('error', swallowError)
	.pipe(gulp.dest('./client/dist'))
});


gulp.task('watch', ['serve'], function(){
  	gulp.watch('client/**/*.**', reload);
	gulp.watch('./client/*.js', ['browserify']);
	gulp.watch('./client/components/*.js', ['browserify']);
});

gulp.task('default', ['watch', 'browserify']);
