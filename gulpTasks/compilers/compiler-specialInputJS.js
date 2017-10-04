module.exports = function (gulp, plugins, projectSettings) {
    return function () {
           return gulp.src([
                projectSettings.settingsPaths.srcFolderPath +
                '/js/scripts/'+
                projectSettings.settingsPaths.specialInputPathJS+
                '/*.js'
               ,
                projectSettings.settingsPaths.distFolderPath + '/js/' + projectSettings.settingsFileNames.distFileJs+'.js'
            ])
                .pipe(plugins.concat(projectSettings.settingsFileNames.distFileJs+'.concat.js'))
                .pipe(gulp.dest(projectSettings.settingsPaths.distFolderPath + '/js'));

    };
};