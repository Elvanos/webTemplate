module.exports = function (gulp, plugins, projectSettings) {
    return function () {

        let distFolderPath = projectSettings.settingsPaths.distFolderPath;


        return gulp
            .src(
                [
                    distFolderPath + '/js/*.js',
                    '!' + distFolderPath + '/js/*.min.js'
                ]
            )
            .pipe(plugins.plumberNotifier())
            .pipe(plugins.uglify())
            .pipe(plugins.beautify
                (
                    {indent_size: 4}
                )
            )
            .pipe(gulp.dest(distFolderPath + '/js'));


    };
};