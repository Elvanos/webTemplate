// Compiler Sass (development)
module.exports = function (gulp, plugins, projectSettings) {
    return function () {

        let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
        let srcFileSass = projectSettings.settingsFileNames.srcFileSass;
        let distFileCss = projectSettings.settingsFileNames.distFileCss;
        let distFolderPath = projectSettings.settingsPaths.distFolderPath;
        
        gulp.task('compiler-sassDevelopment', () =>
            gulp.src(srcFolderPath + '/sass/' + srcFileSass + '.sass')
                .pipe(plugins.sass(
                    {
                        importer: plugins.globImporter()
                    }
                )
                    .on('error', plugins.sass.logError))
                .pipe(plugins.sourcemaps.init())
                .pipe(plugins.postcss([plugins.autoprefixer()]))
                .pipe(plugins.rename(distFileCss + ".css"))
                .pipe(plugins.sourcemaps.write('', {
                    includeContent: false,
                    sourceRoot: srcFolderPath + '/sass/' + srcFileSass+ '.sass'
                }))
                .pipe(gulp.dest(distFolderPath + '/css/'))
        );
    };
};