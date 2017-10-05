module.exports = function (gulp, plugins, projectSettings) {
    return function () {
        
        let distFolderPath = projectSettings.settingsPaths.distFolderPath;
        
        return gulp
            .src(
                [
                    distFolderPath + '/js/*.js',
                    '!'+distFolderPath + '/js/*.min.js'
                ]
            )
            .pipe(plugins.uglify())
            .pipe(plugins.rename({ extname: '.min.js' }))
            .pipe(gulp.dest(distFolderPath + '/js'));




    };
};