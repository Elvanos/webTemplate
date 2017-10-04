// Compiler Sass (development)
module.exports = function (gulp, plugins, projectSettings) {
    return function () {
        gulp.task('compiler-additionalSassDevelopment', () =>
            gulp.src(
                [
                    projectSettings.settingsPaths.srcFolderPath +
                    '/sass/additionalFiles/*.sass',
                    projectSettings.settingsPaths.srcFolderPath +
                    '/sass/additionalFiles/*.scss',
                    '!'+projectSettings.settingsPaths.srcFolderPath +
                    '/sass/additionalFiles/ignore/*.sass',
                    '!'+projectSettings.settingsPaths.srcFolderPath +
                    '/sass/additionalFiles/ignore/*.scss'
                ]
                )
                .pipe(plugins.sass(
                    {
                        importer: plugins.globImporter()
                    }
                )
                    .on('error', plugins.sass.logError))
                .pipe(plugins.sourcemaps.init())
                .pipe(plugins.postcss([plugins.autoprefixer()]))
                .pipe(gulp.dest(projectSettings.settingsPaths.distFolderPath + '/css/'))
        );
    };
};