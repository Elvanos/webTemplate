// Watcher - Rollup (JS, JSX, ES6, Coffee script and Main.js rollup file)
module.exports = function (gulp, plugins, projectSettings) {
    return function () {
        gulp.watch([
            projectSettings.srcFolderPath + '/js/main.js',
            projectSettings.srcFolderPath + '/js/**/*.js',
            projectSettings.srcFolderPath + '/js/**/*.coffee',
            projectSettings.srcFolderPath + '/js/**/*.jxs',
            projectSettings.srcFolderPath + '/js/specialInput/**/**',
            projectSettings.srcFolderPath + '/js/specialInput/**'
        ], ['bundle-compilers-js']);
    };
};