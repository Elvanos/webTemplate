// Watcher - Rollup (JS, JSX, ES6, Coffee script and Main.js rollup file)
module.exports = function (gulp, plugins, projectSettings, callback) {

        let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
        let specialInputPathJS = projectSettings.settingsPaths.specialInputPathJS;
        let allowAdditionalJS = projectSettings.settingsGeneration.allowAdditionalJS;

        if (allowAdditionalJS === "true"){

            gulp.watch([
                srcFolderPath + '/js/scripts/**/*',
                srcFolderPath + '/js/scripts/'+ specialInputPathJS + '/**/**',
                srcFolderPath + '/js/scripts/' + specialInputPathJS + '/**'
            ], callback);

        }else{

            gulp.watch([
                srcFolderPath + '/js/scripts/**/*',
                '!' + srcFolderPath + '/js/scripts/'+ specialInputPathJS + '/**/**',
                '!' + srcFolderPath + '/js/scripts/' + specialInputPathJS + '/**'
            ], callback);

        }



};