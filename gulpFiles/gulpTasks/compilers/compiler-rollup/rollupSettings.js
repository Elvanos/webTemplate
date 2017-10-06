module.exports = function (gulp, plugins, projectSettings) {

    let sourceFile;

    let autogenBuildFile = projectSettings.settingsGeneration.autogenBuildFile;
    let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
    let name = projectSettings.name;
    let distFileJs = projectSettings.settingsFileNames.distFileJs;
    let distFolderPawth = projectSettings.settingsPaths.distFolderPath;

    if (autogenBuildFile === "true") {
        sourceFile = 'importsBundle.js';
    } else {
        sourceFile = 'manualBundle.js';
    }

    return function () {
        return gulp.src(srcFolderPath + '/js/'+sourceFile)
            .pipe(plugins.rollup(
                {
                    moduleName: name,
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
                        //plugins.async(),
                        /*plugins.resolve({
                            main: true,
                            browser: true,
                            extensions: ['.js', '.coffee', '.csjx']
                        }),*/
                        plugins.babel({
                            exclude: ['node_modules/!**'] // only transpile our source code
                        }),
                        /*plugins.commmonjs({
                            extensions: ['.js', '.coffee', '.cjsx']
                        }),*/
                        plugins.coffeeReact({
                            exclude: 'node_modules/!**'
                        })
                    ]

                }, 'iife'
                )
            )
            .pipe(plugins.rename(distFileJs + ".js"))
            .pipe(gulp.dest(distFolderPawth + '/js'))
    };
}
;