// Compiler Sass (development)
module.exports = function (gulp, plugins, projectSettings) {
    return function () {
        gulp.task('compiler-sassDevelopment', () =>
            gulp.src(
                projectSettings.settingsPaths.srcFolderPath +
                '/sass/'+
                projectSettings.settingsFileNames.srcFileSass+
                '.sass')
                .pipe(plugins.sass(
                    {
                        importer: plugins.globImporter()
                    }
                )
                    .on('error', plugins.sass.logError))
                .pipe(plugins.sourcemaps.init())
                .pipe(plugins.postcss([plugins.autoprefixer()]))
                .pipe(plugins.rename(projectSettings.settingsFileNames.distFileCss + ".css"))
                .pipe(plugins.sourcemaps.write('', {
                    includeContent: false,
                    sourceRoot:
                    projectSettings.settingsPaths.srcFolderPath +
                    '/sass/'+
                    projectSettings.settingsFileNames.srcFileSass+
                    '.sass'
                }))
                .pipe(gulp.dest(projectSettings.settingsPaths.distFolderPath + '/css/'))
        );
    };
};