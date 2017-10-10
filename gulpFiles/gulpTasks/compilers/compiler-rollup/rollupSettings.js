module.exports = function (gulp, plugins, projectSettings) {

    let taskName = 'compiler-rollup/rollupSettings';

    let sourceFile;

    let autogenBuildFile = projectSettings.settingsGeneration.autogenBuildFile;
    let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
    let name = projectSettings.name;
    let distFileJs = projectSettings.settingsFileNames.distFileJs;
    let distFolderPath = projectSettings.settingsPaths.distFolderPath;

    let notSettings = projectSettings.settingsNotification.javascriptCompiler;

    if (autogenBuildFile === "true") {
        sourceFile = 'importsBundle.js';
    } else {
        sourceFile = 'manualBundle.js';
    }

    return function () {
        return gulp.src(srcFolderPath + '/js/' + sourceFile)
            .pipe(plugins.plumberNotifier())
            //.pipe(plugins.sourcemaps.init())
            .pipe(plugins.rollup(
                {
                    moduleName: name,
                    cache: true,
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
                        plugins.babel({
                            exclude: ['node_modules/!**']
                        }),
                        plugins.coffeeReact({
                            exclude: 'node_modules/!**'
                        })
                    ]

                }, 'iife'
                )
            )
            .pipe(plugins.rename(distFileJs + ".js"))
            //.pipe(plugins.sourcemaps.write(''))
            .pipe(gulp.dest(distFolderPath + '/js'))
            .pipe(plugins.tap(
                function (file) {

                    plugins.notifier.notify(
                        {
                            title: projectSettings.name + ' - ' + taskName,
                            message: distFileJs + '.js file successfully compiled!',
                            sound: false
                        });

                    console.log(
                        (
                            'Task: ' + taskName + '\n' +
                            'Message: ' + distFileJs + '.js file successfully compiled!' + '\n'
                        )
                            .green
                    );
                }
            ))
    };
}
;
