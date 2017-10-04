// Watcher - SASS
module.exports = function (gulp, plugins, projectSettings, callback) {
    return function () {
        gulp.watch([
            projectSettings.settingsPaths.srcFolderPath + '/sass/additionalFiles/*.sass',
            projectSettings.settingsPaths.srcFolderPath + '/sass/additionalFiles/*.scss',
            ]
            , callback
        );
    };
};