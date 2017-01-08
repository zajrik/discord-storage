var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');

gulp.task('default', () =>
{
	del.sync(['./bin/**/*.*']);
	gulp.src('./src/**/*.ts')
		.pipe(ts({
			noImplicitAny: true,
			outDir: 'bin',
			target: 'ES6',
			module: 'commonjs',
			moduleResolution: 'node'
		}))
		.pipe(gulp.dest('bin/'));
	gulp.src('./src/config.json')
		.pipe(gulp.dest('bin/'));
});

gulp.task('package', (done) =>
{
	gulp.src('src/**/*ts')
		.pipe(ts({
			noImplicitAny: true,
			outDir: 'bin',
			target: 'ES6',
			module: 'commonjs',
			moduleResolution: 'node'
		}))
		.pipe(gulp.dest('pkg/discord-storage/bin'));
	gulp.src('src/**/*.json')
		.pipe(gulp.dest('pkg/discord-storage/bin'));
	gulp.src(['package.json', '*.md'])
		.pipe(gulp.dest('pkg/discord-storage'));
	done();
});

gulp.task('clean-package', (done) =>
{
	del.sync(['pkg/discord-storage/bin/**', '!pkg/discord-storage/bin']);
	done();
});
