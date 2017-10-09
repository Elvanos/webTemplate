module.exports = function (gulp, plugins, projectSettings) {
    return function () {

        let taskName = 'utility-uglify';

        let distFolderPath = projectSettings.settingsPaths.distFolderPath;

        return gulp
            .src(
                [
                    distFolderPath + '/js/*.js',
                    '!'+distFolderPath + '/js/*.min.js'
                ]
            )
            .pipe(plugins.plumberNotifier())
            .pipe(plugins.uglify())
            .pipe(plugins.rename({ extname: '.min.js' }))
            .pipe(gulp.dest(distFolderPath + '/js'))
            .pipe(plugins.tap(
                function (file) {

                    file = plugins.path.basename(file.path)

                    plugins.notifier.notify(
                        {
                            title: projectSettings.name + ' - ' + taskName,
                            message: file + ' file successfully compiled!',
                            sound: false
                        });

                    console.log(
                        (
                            'Task: ' + taskName + '\n' +
                            'Message: ' + file + ' file successfully compiled!'+'\n'
                        )
                            .green
                    );
                }
            ))

    };
};