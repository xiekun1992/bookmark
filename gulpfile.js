var gulp=require('gulp'),
	uglify=require('gulp-uglify'),
	rename=require('gulp-rename'),
	minifyCss=require('gulp-minify-css'),
	sourcemaps=require('gulp-sourcemaps'),
	staticHash=require('gulp-static-hash'),
	clean=require('gulp-clean');

gulp.task('uglify-js',function(){
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

gulp.task('minify-css',function(){
	gulp.src('./public/stylesheets/**/*.css')
		.pipe(minifyCss())
		.pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('static-hash',function(){
	gulp.src('./public/htmls/**/*.html')
		.pipe(staticHash({
			asset:'./public',
			exts:['js','css','png','jpg','bmp','gif','ico']
		}))
		.pipe(gulp.dest('./app/views/'));
});

gulp.task('clean',function(){
	gulp.src('./app/views/**/*.html',{read:false})
		.pipe(clean());
});

gulp.task('watch',function(){
	gulp.watch('./public/javascripts/**/*.js',['uglify-js','minify-css']);
	gulp.watch('./public/htmls/**/*.html',['clean','static-hash']);
});

gulp.task('default',['uglify-js','minify-css','clean','static-hash','watch']);