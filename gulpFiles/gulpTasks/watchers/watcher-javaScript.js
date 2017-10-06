// Watcher - Rollup (JS, JSX, ES6, Coffee script and Main.js rollup file)
module.exports = function (gulp, plugins, projectSettings, callback) {

        let srcFolderPath = projectSettings.settingsPaths.srcFolderPath;
        let specialInputPathJS = projectSettings.settingsPaths.specialInputPathJS;
        let allowAdditionalJS = projectSettings.settingsGeneration.allowAdditionalJS;

        if (allowAdditionalJS === "true"){

            gulp.watch([
                srcFolderPath + '/js/scripts/**/*.js',
                srcFolderPath + '/js/scripts/**/*.coffee',
                srcFolderPath + '/js/scripts/**/*.jxs',
                srcFolderPath + '/js/scripts/'+ specialInputPathJS + '/**/**',
                srcFolderPath + '/js/scripts/' + specialInputPathJS + '/**',
                '!' + srcFolderPath + '/js/importsBundle.js'
            ], callback);

        }else{

            gulp.watch([
                srcFolderPath + '/js/scripts/**/*.js',
                srcFolderPath + '/js/scripts/**/*.coffee',
                srcFolderPath + '/js/scripts/**/*.jxs',
                '!' + srcFolderPath + '/js/scripts/'+ specialInputPathJS + '/**/**',
                '!' + srcFolderPath + '/js/scripts/' + specialInputPathJS + '/**',
                '!' + srcFolderPath + '/js/importsBundle.js'
            ], callback);

        }



};