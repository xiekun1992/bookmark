var gulp=require('gulp'),
	uglify=require('gulp-uglify'),
	rename=require('gulp-rename'),
	minifyCss=require('gulp-minify-css'),
	sourcemaps=require('gulp-sourcemaps'),
	staticHash=require('gulp-static-hash'),
	clean=require('gulp-clean');

var src='./public/src',build='./public/build';

var imagesSrc=[src+'/images/**/*.*',src+'/images/*.*'],
	scriptsSrc=[src+'/javascripts/**/*.js',src+'/javascripts/*.js'],
	stylesSrc=[src+'/stylesheets/**/*.css',src+'/stylesheets/*.css'];

gulp.task('uglify-js',function(){
	gulp.src(scriptsSrc)
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename(function(path){
			path.basename+=".min";
			path.extname=".js";
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(build+'/javascripts/'));
});

gulp.task('minify-css',function(){
	gulp.src(stylesSrc)
		.pipe(minifyCss())
		.pipe(rename(function(path){
			path.basename+=".min";
			path.extname=".css";
		}))
		.pipe(gulp.dest(build+'/stylesheets/'));
});

gulp.task('copy-images',function(){
	gulp.src(imagesSrc)
		.pipe(gulp.dest(build+'/images/'));
});

gulp.task('static-hash',function(){
	gulp.src(src+'/htmls/**/*.html')
		.pipe(staticHash({
			asset:src,
			exts:['js','css','png','jpg','bmp','gif','ico']
		}))
		.pipe(gulp.dest('./app/views/'));
});

gulp.task('clean',function(){
	gulp.src('./app/views/**/*.html',{read:false})
		.pipe(clean());
});

gulp.task('watch',function(){
	gulp.watch(scriptsSrc,['uglify-js']);
	gulp.watch(stylesSrc,['minify-css']);
	gulp.watch(imagesSrc,['copy-images']);
	gulp.watch(src+'/htmls/**/*.html',['clean','static-hash']);
});

gulp.task('default',[
	'uglify-js',
	'minify-css',
	'clean',
	'static-hash',
	'copy-images',
	'watch'
]);