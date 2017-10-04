module.exports = function (gulp, plugins, projectSettings) {

    let sourceFile;
    //console.log(projectSettings.settingsGeneration);

    if (projectSettings.settingsGeneration.autogenBuildFile === "true") {
        sourceFile = 'importsBundle.js';
    } else {
        sourceFile = 'manualBundle.js';
    }

    //console.log(sourceFile);

    return function () {
        return gulp.src(projectSettings.settingsPaths.srcFolderPath + '/js/'+sourceFile)
            .pipe(plugins.rollup(
                {
                    moduleName: projectSettings.name,
                    //cache: true,
                    onwarn: function (warning) {
                        // Skip certain warnings

                        // should intercept ... but doesn't in some rollup versions
                        if (warning.code === 'THIS_IS_UNDEFINED') {
                            return;
                        }

                        // console.warn everything else
                        console.warn(warning.message);
                    },
                    plugins: [
                        plugins.async(),
                        plugins.resolve({
                            main: true,
                            browser: true,
                            extensions: ['.js', '.coffee', '.csjx']
                        }),
                        plugins.babel({
                            exclude: ['node_modules/!**'] // only transpile our source code
                        }),
                        plugins.commmonjs({
                            extensions: ['.js', '.coffee', '.cjsx']
                        }),
                        plugins.coffeeReact({
                            exclude: 'node_modules/!**'
                        })
                    ]

                }, 'iife'
                )
            )
            .pipe(plugins.rename(projectSettings.settingsFileNames.distFileJs + ".js"))
            .pipe(gulp.dest(projectSettings.settingsPaths.distFolderPath + '/js'))
    };
}
;