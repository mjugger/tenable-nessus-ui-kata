var gulp = require('gulp');
var concat = require('gulp-concat');
var cleanMinify = require('gulp-clean-css');
var stylus = require('gulp-stylus');
var mainBowerFiles = require('gulp-main-bower-files');
var uglify = require('gulp-uglify');
var karmaServer = require('karma').Server;

gulp.task('bdd-test',function(done){
	new karmaServer({
		configFile:"./karma.config.js",
		singleRun:false
	},done);
});

gulp.task('bowerStyles',function(){
	return gulp.src('bower.json')
	.pipe( mainBowerFiles('**/*.css') )
	.pipe( concat('helperStyles.css') )
	.pipe( cleanMinify() )
	.pipe( gulp.dest('build/css') );
});

gulp.task('scripts',function(){
	return gulp.src('source/scripts/*.js')
		.pipe(concat('all.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/js'));
});

gulp.task('watch',function(){
	gulp.watch('source/styles/*.styl',['bowerStyles']);
	gulp.watch('source/scripts/*.js',['scripts']);
});

gulp.task('default',['bowerStyles','scripts','watch']);