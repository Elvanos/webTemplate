// Fix formatting to make the file more readable
module.exports = function (gulp, plugins, projectSettings) {
    return function () {

        let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
        let autogenBuildFile = projectSettings.settingsGeneration.autogenBuildFile;

        if (autogenBuildFile === "true") {
        return gulp.src(srcFolderPath + '/js/importsBundle.js')
            .pipe(plugins.plumberNotifier())
            .pipe(plugins.beautify
                (
                    {indent_size: 4}
                )
            )
            .pipe(gulp.dest(srcFolderPath + '/js'));
        }else{
            return true;
        }

    };
}
;