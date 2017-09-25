// Watcher - SASS
module.exports = function (gulp, plugins, projectSettings) {
    return function () {
        gulp.watch(projectSettings.srcFolderPath + '/sass/**/*.sass', ['compiler-sassCompressed', 'compiler-sassDevelopment']);
    };
};