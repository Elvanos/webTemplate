// Compiler Sass (compressed)
module.exports = function (gulp, plugins, projectSettings) {
    return function () {
        gulp.task('compiler-sassCompressed', () =>
            gulp.src(
                projectSettings.settingsPaths.srcFolderPath +
                '/sass/'+
                projectSettings.settingsFileNames.srcFileSass+
                '.sass'
            )
                .pipe(plugins.sass({
                        outputStyle: 'compressed',
                        importer: plugins.globImporter()
                    }
                )
                    .on('error', plugins.sass.logError))
                .pipe(plugins.postcss([plugins.autoprefixer()]))
                .pipe(plugins.rename(projectSettings.settingsFileNames.distFileCss + ".min.css"))
                .pipe(gulp.dest(projectSettings.settingsPaths.distFolderPath + '/css/'))
        );
    };
};
