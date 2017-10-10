// Compiler Sass (compressed)
module.exports = function (gulp, plugins, projectSettings) {

    let taskName = 'compiler-sassCompressed';


    return function () {
        let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
        let srcFileSass = projectSettings.settingsFileNames.srcFileSass;
        let distFileCss = projectSettings.settingsFileNames.distFileCss;
        let distFolderPath = projectSettings.settingsPaths.distFolderPath;

        let notSettings = projectSettings.settingsNotification.sassCompilerCompressed;


        return gulp
            .src(srcFolderPath + '/sass/' + srcFileSass + '.sass')
            .pipe(plugins.plumberNotifier())
            .pipe(plugins.sass({
                    outputStyle: 'compressed',
                    importer: plugins.globImporter()
                })
            )
            .pipe(plugins.postcss([plugins.autoprefixer()]))
            .pipe(plugins.rename(distFileCss + ".min.css"))
            .pipe(gulp.dest(distFolderPath + '/css/'))
            .pipe(plugins.tap(
                function (file) {

                    // Check notification settings
                    if (notSettings === 'both' || notSettings === 'notification') {

                        plugins.notifier.notify(
                            {
                                title: projectSettings.name + ' - ' + taskName,
                                message: distFileCss + '.min.css file successfully compiled!',
                                sound: false
                            });

                    }

                    if(notSettings === 'both' || notSettings === 'console'){

                        console.log(
                            (
                                'Task: ' + taskName + '\n' +
                                'Message: ' + distFileCss + '.min.css file successfully compiled!'+'\n'
                            )
                                .green
                        );

                    }
                }
            ))

    }

};