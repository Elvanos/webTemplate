// Compiler Sass (compressed)
module.exports = function (gulp, plugins, projectSettings) {
    return function () {
        gulp.task('compiler-additionalSassCompressed', () =>
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
                .pipe(plugins.sass({
                        outputStyle: 'compressed',
                        importer: plugins.globImporter()
                    }
                )
                    .on('error', plugins.sass.logError))
                .pipe(plugins.postcss([plugins.autoprefixer()]))
                .pipe(plugins.rename({suffix: '.min'}))
                .pipe(gulp.dest(projectSettings.settingsPaths.distFolderPath + '/css/'))
        );
    };
};
