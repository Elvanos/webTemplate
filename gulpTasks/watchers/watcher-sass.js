// Watcher - SASS
module.exports = function (gulp, plugins, projectSettings, callback) {
    return function () {
        gulp.watch(projectSettings.srcFolderPath + '/sass/**/*.sass', callback);
    };
};