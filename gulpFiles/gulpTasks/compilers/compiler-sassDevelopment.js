// Compiler Sass (development)
module.exports = function (gulp, plugins, projectSettings) {

    let taskName = 'compiler-sassDevelopment';


    return function () {
        let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
        let srcFileSass = projectSettings.settingsFileNames.srcFileSass;
        let distFileCss = projectSettings.settingsFileNames.distFileCss;
        let distFolderPath = projectSettings.settingsPaths.distFolderPath;


        return gulp
            .src(srcFolderPath + '/sass/' + srcFileSass + '.sass')
            .pipe(plugins.plumberNotifier())
            .pipe(plugins.sass(
                {
                    importer: plugins.globImporter()
                }
            ))
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.postcss([plugins.autoprefixer()]))
            .pipe(plugins.rename(distFileCss + ".css"))
            .pipe(plugins.sourcemaps.write('', {
                includeContent: false,
                sourceRoot: srcFolderPath + '/sass/' + srcFileSass + '.sass'
            }))
            .pipe(gulp.dest(distFolderPath + '/css/'))
            .pipe(plugins.tap(
                function (file) {
                    let fileExtension = plugins.path.extname(file.path).substr(1);

                    if (fileExtension !== 'map') {
                        plugins.notifier.notify(
                            {
                                title: projectSettings.name + ' - ' + taskName,
                                message: distFileCss + ' file successfully compiled!',
                                sound: false
                            }
                        );
                        console.log(
                            (
                                'Task: ' + taskName + '\n' +
                                'Message: ' + distFileCss + ' file successfully compiled!'+'\n'
                            )
                                .green
                        );
                    }
                }
            ))

    }

};