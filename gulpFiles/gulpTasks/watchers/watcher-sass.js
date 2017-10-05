// Watcher - SASS
module.exports = function (gulp, plugins, projectSettings, callback) {

        let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
        let specialInputPathSass = projectSettings.settingsPaths.specialInputPathSass;


    gulp.watch([
            srcFolderPath + '/sass/**/*.sass',
            srcFolderPath + '/sass/**/*.scss',
            '!'+srcFolderPath + '/sass/' + specialInputPathSass + '/**'
            ]
            , callback
        );

};