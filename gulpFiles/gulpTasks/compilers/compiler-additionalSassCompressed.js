// Compiler Additional Sass (compressed)
module.exports = function (gulp, plugins, projectSettings) {

    let taskName = 'compiler-additionalSassCompressed';


    return function () {
        let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
        let distFolderPath = projectSettings.settingsPaths.distFolderPath;
        let specialInputPathSass = projectSettings.settingsPaths.specialInputPathSass;

        let notSettings = projectSettings.settingsNotification.sassCompilerCompressedAdditional;

        return gulp
            .src(
                [
                    srcFolderPath + '/sass/' + specialInputPathSass + '/*.sass',
                    srcFolderPath + '/sass/' + specialInputPathSass + '/*.scss',
                    '!' + srcFolderPath + '/sass/' + specialInputPathSass + '/ignore/*.sass',
                    '!' + srcFolderPath + '/sass/' + specialInputPathSass + '/ignore/*.scss'
                ]
            )
            .pipe(plugins.plumberNotifier())
            .pipe(plugins.sass(
                {
                    outputStyle: 'compressed',
                    importer: plugins.globImporter()
                }
                )
            )
            .pipe(plugins.postcss([plugins.autoprefixer()]))
            .pipe(plugins.rename({
                    extname: '.min.css'
                })
            )
            .pipe(gulp.dest(distFolderPath + '/css/'))
            .pipe(plugins.tap(
                function (file) {

                    file = plugins.path.basename(file.path)

                    // Check notification settings
                    if (notSettings === 'both' || notSettings === 'notification') {

                        plugins.notifier.notify(
                            {
                                title: projectSettings.name + ' - ' + taskName,
                                message: file + ' file successfully compiled!',
                                sound: false
                            });

                    }

                    if(notSettings === 'both' || notSettings === 'console'){

                        console.log(
                            (
                                'Task: ' + taskName + '\n' +
                                'Message: ' + file + ' file successfully compiled!'+'\n'
                            )
                                .green
                        );

                    }
                }
            ))

    }

};