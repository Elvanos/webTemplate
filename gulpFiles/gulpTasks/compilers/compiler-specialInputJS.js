module.exports = function (gulp, plugins, projectSettings) {
    return function () {
        
            let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
            let specialInputPathJS = projectSettings.settingsPaths.specialInputPathJS;
            let distFolderPath = projectSettings.settingsPaths.distFolderPath;
            let distFileJs = projectSettings.settingsFileNames.distFileJs;
        
            return gulp.src(
                    [
                        srcFolderPath + '/js/scripts/' + specialInputPathJS+ '/*.js',
                        distFolderPath + '/js/' + distFileJs+ '.js'
                    ]
                )
                .pipe(plugins.plumberNotifier())
                .pipe(plugins.concat(distFileJs + '.concat.js'))
                .pipe(gulp.dest(distFolderPath + '/js'));

    };
};