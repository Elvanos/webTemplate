// Compiler Sass (compressed)
module.exports = function (gulp, plugins, projectSettings) {
    return function () {
        gulp.task('compiler-sassCompressed', () =>
            plugins.rubySass(projectSettings.srcFolderPath + '/sass/layout.sass', {
                style: 'compressed'
            })
                .on('error', plugins.rubySass.logError)
                .pipe(plugins.postcss([plugins.autoprefixer()]))
                .pipe(plugins.rename(projectSettings.cssFileName + ".min.css"))
                .pipe(gulp.dest(projectSettings.distFolderPath + '/css/'))
        );
    };
};
