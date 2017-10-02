// Fix formatting to make the file more readable
module.exports = function (gulp, plugins, projectSettings) {
    return function () {

        if (projectSettings.settingsGeneration.autogenBuildFile === "true") {
        return gulp.src(projectSettings.settingsPaths.srcFolderPath + '/js/importsBundle.js')
            .pipe(plugins.beautify
                (
                    {indent_size: 4}
                )
            )
            .pipe(gulp.dest(projectSettings.settingsPaths.srcFolderPath + '/js'));
        }else{
            return true;
        }

    };
}
;