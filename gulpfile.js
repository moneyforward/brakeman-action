const del = require('del');
const gulp = require('gulp');

function spawn(command, args = [], options) {
  const child = require('child_process')
    .spawn(command, args.filter(e => e === 0 || e), options);
  if (child.stdout) child.stdout.pipe(process.stdout);
  if (child.stderr) child.stderr.pipe(process.stderr);
  return child;
}

exports['transpile:ncc'] = function ncc() {
  return spawn('ncc', ['build', './src/index.ts', '-m']);
}

exports['lint:eslint'] = function eslint() {
  return spawn('eslint', ['.', '--ext', '.js,.jsx,.ts,.tsx']);
}

exports['test:mocha'] = function mocha() {
  return spawn('mocha', ['-c']);
}

exports['watch:typescript'] = function watchTypeScript() {
  const task = gulp.parallel(exports['transpile:ncc'], exports['lint:eslint']);
  return gulp.watch('./src/**/*.ts{,x}', task);
}

exports.clean = function clean() {
  return del('dist');
};
exports.transpile = gulp.parallel(exports['transpile:ncc']);
exports.lint = gulp.parallel(exports['lint:eslint']);
exports.build = gulp.parallel(exports.lint, exports.transpile);
exports.test = gulp.series(exports['test:mocha']);
exports.watch = gulp.parallel(exports['watch:typescript']);
exports.default = exports.build;
