var gulp=require('gulp'),
	uglify=require('gulp-uglify'),
	rename=require('gulp-rename'),
	sourcemaps=require('gulp-sourcemaps');

gulp.task('uglify',function(){
	gulp.src('./public/javascripts/src/bookmark/*.js')
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename(function(path){
			path.basename+=".min";
			path.extname=".js";
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./public/javascripts/build/bookmark/'));
});

gulp.task('watch',function(){
	gulp.watch('./public/javascripts/**/*.js',['uglify']);
});

gulp.task('default',['uglify','watch']);