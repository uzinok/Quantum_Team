const {
	src,
	dest,
	watch,
	series,
	parallel
} = require('gulp');

// clean
const del = require('del');
// browserSync
const browserSync = require('browser-sync').create();
// error
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

// styles
const less = require('gulp-less');
const autoprefixer = require('autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const postcss = require('gulp-postcss');
const postLess = require('postcss-less');
const postImport = require('postcss-import');
const postUrl = require('postcss-url');


// scripts
const babel = require('gulp-babel');
const minify = require('gulp-minify');

// html
const pug = require("gulp-pug");

const paths = {
	dest: 'dest',
	src: 'src',
	styles: {
		src: 'src/styles/*.less',
		watch: 'src/styles/**/*.less',
		dest: 'dest/styles/'
	},
	scripts: {
		src: 'src/scripts/**/*.js',
		watch: 'src/scripts/**/*.js',
		dest: 'dest/scripts/'
	},
	html: {
		src: 'src/pug/*.pug',
		watch: 'src/pug/**/*.pug',
		dest: 'dest/'
	},
	img: {
		resource: './src/resource/img',
		resourceSvg: './src/resource/svg',
		src: './src/img',
	},
	fonts: {
		src: './src/fonts',
		resource: './src/resource/fonts',
	}
}

const onError = function(err) {
	notify.onError({
		title: "Gulp",
		subtitle: "Failure!",
		message: "Error: <%= error.message %>",
		sound: "Beep"
	})(err);
	this.emit('end');
}

// clean
function clean() {
	return del(paths.dest);
}

// copy
function copy() {
	return src([
			"./src/fonts/*.{woff2,woff}",
			"./src/*.ico",
			"./src/img/**/*.{svg,jpg,jpeg,png,webp,avif}",
			"./src/favicons/*",
			"./src/*.webmanifest"
		], {
			base: paths.src
		})
		.pipe(dest(paths.dest));
}

// styles
function styles() {
	return src(paths.styles.src, {
			sourcemaps: true
		})
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Task styles',
					message: "Error: <%= error.message %>",
					sound: true
				}
			})
		}))
		.pipe(postcss([
			postImport(),
			postUrl()
		], {
			syntax: postLess
		}))
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(less())
		.pipe(gcmq())
		.pipe(postcss([
			autoprefixer(),
		]))
		.pipe(dest(paths.styles.dest, {
			sourcemaps: "."
		}))
		.pipe(browserSync.stream());
}

// scripts
function scripts() {
	return src(paths.scripts.src)
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Task scripts',
					message: "Error: <%= error.message %>",
					sound: true
				}
			})
		}))
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(minify({
			ext: {
				src: '.js',
				min: '.min.js'
			},
			exclude: ['tasks']
		}))
		.pipe(dest(paths.scripts.dest))
		.pipe(browserSync.stream());
}

// html
function html() {
	return src("src/pug/*.pug")
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Task html',
					message: "Error: <%= error.message %>",
					sound: true
				}
			})
		}))
		.pipe(pug({
			pretty: true
		}))
		.pipe(dest(paths.html.dest))
		.pipe(browserSync.stream());
}

// watch
function watchFiles() {
	watch(paths.styles.watch, styles)
	watch(paths.scripts.watch, scripts)
	watch(paths.html.watch, html)
}

// server
function server() {
	browserSync.init({
		server: {
			baseDir: paths.dest
		}
	});

	watchFiles();
}

// clean
exports.clean = clean;
// copy
exports.copy = copy;
// styles
exports.styles = styles;
// watchFiles
exports.watchFiles = watchFiles;
// scripts
exports.scripts = scripts;
// html
exports.html = html;
// server
exports.server = server;

exports.build = series(clean, copy, scripts, parallel(styles, html))

exports.default = series(clean, copy, scripts, parallel(styles, html), server);
