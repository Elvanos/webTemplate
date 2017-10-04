// Watcher - Rollup (JS, JSX, ES6, Coffee script and Main.js rollup file)
module.exports = function (gulp, plugins, projectSettings, callback) {
    return function () {
         gulp.watch([
            projectSettings.settingsPaths.srcFolderPath + '/js/scripts/**/*.js',
            projectSettings.settingsPaths.srcFolderPath + '/js/scripts/**/*.coffee',
            projectSettings.settingsPaths.srcFolderPath + '/js/scripts/**/*.jxs',
            projectSettings.settingsPaths.srcFolderPath + '/js/scripts/specialInput/**/**',
            projectSettings.settingsPaths.srcFolderPath + '/js/scripts/specialInput/**',
            '!'+projectSettings.settingsPaths.srcFolderPath + '/js/importsBundle.js'
        ], callback);
    };
};