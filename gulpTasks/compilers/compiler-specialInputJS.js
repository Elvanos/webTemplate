module.exports = function (gulp, plugins, projectSettings) {
    return function () {
           return gulp.src([
                projectSettings.srcFolderPath + '/js/specialInput/*.js',
                projectSettings.distFolderPath+'/js/'+projectSettings.jsFileName+'.js'
            ])
                .pipe(plugins.concat(projectSettings.jsFileName+'.concat.js'))
                .pipe(gulp.dest(projectSettings.distFolderPath + '/js'));

    };
};