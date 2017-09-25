module.exports = function (gulp, plugins, projectSettings) {
    return function () {
        return gulp
            .src(
                [
                    projectSettings.distFolderPath+'/js/'+projectSettings.jsFileName+'.concat.js'
                ]
            )
            .pipe(plugins.uglify())
            .pipe(plugins.rename(projectSettings.jsFileName + ".concat.min.js"))
            .pipe(gulp.dest(projectSettings.distFolderPath + '/js'));

    };
};