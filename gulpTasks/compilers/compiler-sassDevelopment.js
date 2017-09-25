// Compiler Sass (development)
module.exports = function (gulp, plugins, projectSettings) {
    return function () {
        gulp.task('compiler-sassDevelopment', () =>
            plugins.rubySass(projectSettings.srcFolderPath + '/sass/layout.sass', {
                sourcemap: true,
                bundleExec: true,
                require: "sass-globbing"
            })
                .on('error', plugins.rubySass.logError)
                .pipe(plugins.sourcemaps.init())
                .pipe(plugins.postcss([plugins.autoprefixer()]))
                .pipe(plugins.rename(projectSettings.cssFileName + ".css"))
                .pipe(plugins.sourcemaps.write('', {
                    includeContent: false,
                    sourceRoot: projectSettings.srcFolderPath + '/sass/layout.sass'
                }))
                .pipe(gulp.dest(projectSettings.distFolderPath + '/css'))
        );
    };
};
