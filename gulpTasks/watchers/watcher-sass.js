// Watcher - SASS
module.exports = function (gulp, plugins, projectSettings, callback) {
    return function () {
        gulp.watch([
            projectSettings.settingsPaths.srcFolderPath + '/sass/**/*.sass',
            projectSettings.settingsPaths.srcFolderPath + '/sass/**/*.scss',
            '!'+projectSettings.settingsPaths.srcFolderPath + '/sass/additionalFiles/*',
            ]
            , callback
        );
    };
};