// Compiler Additional Sass (development)
module.exports = function (gulp, plugins, projectSettings) {

    let taskName = 'compiler-additionalSassDevelopment';


    return function () {
        let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
        let distFolderPath = projectSettings.settingsPaths.distFolderPath;
        let specialInputPathSass = projectSettings.settingsPaths.specialInputPathSass;

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
                    importer: plugins.globImporter()
                }
                )
            )
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.postcss([plugins.autoprefixer()]))
            .pipe(plugins.rename({
                    extname: '.css'
                })
            )
            .pipe(plugins.sourcemaps.write(''))
            .pipe(gulp.dest(distFolderPath + '/css/'))
            .pipe(plugins.tap(
                function (file) {

                        let fileExtension = plugins.path.extname(file.path).substr(1);

                        file = plugins.path.basename(file.path)

                        if (fileExtension !== 'map') {
                            plugins.notifier.notify(
                                {
                                    title: projectSettings.name + ' - ' + taskName,
                                    message: file + ' file successfully compiled!',
                                    sound: false
                                }
                            );
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