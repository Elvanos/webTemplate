module.exports = function (gulp, plugins, projectSettings) {
    return function () {

        let taskName = 'compiler-specialInputJS';

        let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
        let specialInputPathJS = projectSettings.settingsPaths.specialInputPathJS;
        let distFolderPath = projectSettings.settingsPaths.distFolderPath;
        let distFileJs = projectSettings.settingsFileNames.distFileJs;

        let notSettings = projectSettings.settingsNotification.javascriptCompilerAdditional;


        return gulp.src(
            [
                srcFolderPath + '/js/scripts/' + specialInputPathJS + '/*.js',
                distFolderPath + '/js/' + distFileJs + '.js'
            ]
        )
            .pipe(plugins.plumberNotifier())
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.concat(distFileJs + '.concat.js'))
            .pipe(plugins.sourcemaps.write(''))
            .pipe(gulp.dest(distFolderPath + '/js'))
            .pipe(plugins.tap(
                function (file) {

                    // Check notification settings
                    if (notSettings === 'both' || notSettings === 'notification') {

                        plugins.notifier.notify(
                            {
                                title: projectSettings.name + ' - ' + taskName,
                                message: distFileJs + '.concat.js file successfully compiled!',
                                sound: false
                            });

                    }

                    if (notSettings === 'both' || notSettings === 'console') {

                        console.log(
                            (
                                'Task: ' + taskName + '\n' +
                                'Message: ' + distFileJs + '.concat.js file successfully compiled!' + '\n'
                            )
                                .green
                        );

                    }


                }
            ))

    };
};