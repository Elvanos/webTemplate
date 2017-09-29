module.exports = function (gulp, plugins, projectSettings) {
    return function () {
        return gulp.src(projectSettings.settingsPaths.srcFolderPath + '/js/importsBundle.js')
            .pipe(plugins.rollup(
                {
                    moduleName: projectSettings.name,
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
        console.log('Done rolling');
    };
}
;