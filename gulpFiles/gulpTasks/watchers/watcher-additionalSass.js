// Watcher - SASS
module.exports = function (gulp, plugins, projectSettings, callback) {

        let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
        let specialInputPathSass = projectSettings.settingsPaths.specialInputPathSass;

        gulp.watch(
            [
                srcFolderPath + '/sass/' +specialInputPathSass+ '/*.sass',
                srcFolderPath + '/sass/' + specialInputPathSass + '/*.scss',
                '!' + srcFolderPath + '/sass/' + specialInputPathSass + '/ignore/*',
            ]
            , callback
        );

};