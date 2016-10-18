var gulp = require('gulp');
var concat = require('gulp-concat');
var cleanMinify = require('gulp-clean-css');
var stylus = require('gulp-stylus');
var mainBowerFiles = require('gulp-main-bower-files');
var uglify = require('gulp-uglify');
var karmaServer = require('karma').Server;

gulp.task('bdd-test',function(done){
	new karmaServer({
		configFile:__dirname+"/karma.config.js",
	},done).start();
});

gulp.task('bowerStyles',function(){
	return gulp.src('bower.json')
	.pipe( mainBowerFiles('**/*.css') )
	.pipe( concat('helperStyles.css') )
	.pipe( cleanMinify() )
	.pipe( gulp.dest('public/css') );
});

gulp.task('bowerScripts',function(){
	return gulp.src('bower.json')
		.pipe(mainBowerFiles('**/*.js'))
		.pipe(concat('helper.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/scripts'));
});

gulp.task('styles',function(){
	return gulp.src('source/styles/styles.styl')
	.pipe( stylus() )
	.pipe( cleanMinify() )
	.pipe( gulp.dest('public/css') );
});

gulp.task('scripts',function(){
	return gulp.src('source/scripts/*.js')
		.pipe(concat('all.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/js'));
});

gulp.task('watch',function(){
	gulp.watch('source/styles/*.styl',['styles']);
	gulp.watch('source/scripts/*.js',['scripts']);
});

gulp.task('default',['bowerStyles','bowerScripts','styles','scripts','bdd-test','watch']);