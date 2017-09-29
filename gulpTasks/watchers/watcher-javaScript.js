// Watcher - Rollup (JS, JSX, ES6, Coffee script and Main.js rollup file)
module.exports = function (gulp, plugins, projectSettings, callback) {
    return function () {
         gulp.watch([
            projectSettings.settingsPaths.srcFolderPath + '/js/**/*.js',
            projectSettings.settingsPaths.srcFolderPath + '/js/**/*.coffee',
            projectSettings.settingsPaths.srcFolderPath + '/js/**/*.jxs',
            projectSettings.settingsPaths.srcFolderPath + '/js/specialInput/**/**',
            projectSettings.settingsPaths.srcFolderPath + '/js/specialInput/**',
            '!'+projectSettings.settingsPaths.srcFolderPath + '/js/importsBundle.js'
        ], callback);
    };
};