module.exports = function (gulp, plugins, projectSettings) {
    return function () {
        return gulp
            .src(
                [
                    projectSettings.settingsPaths.distFolderPath+'/js/*.js',
                    '!'+projectSettings.settingsPaths.distFolderPath+'/js/*.min.js'
                ]
            )
            .pipe(plugins.uglify())
            .pipe(plugins.rename({ extname: '.min.js' }))
            .pipe(gulp.dest(projectSettings.settingsPaths.distFolderPath + '/js'));




    };
};